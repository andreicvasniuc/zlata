require 'rails_helper'

RSpec.describe 'Public SPA shell (meta tags, hreflang, 404)', type: :request do
  let!(:collection) { create_collection('Queen', description: '<p>Dresses   for queens</p>') }
  let!(:product) { create_product(collection, 'Elayza', description: 'A very elegant dress') }

  before do
    collection.create_image(url: 'https://img.example.test/collection.jpg')
    create_image(product, 'https://img.example.test/first.jpg')
    create_image(product, 'https://img.example.test/cover.jpg', is_cover: true)
  end

  def shell(path)
    get path.presence || '/'
    Nokogiri::HTML(response.body)
  end

  def meta(doc, selector)
    doc.at_css(selector)&.[]('content')
  end

  describe 'static pages' do
    it 'renders the home page in the default locale with alternates for every locale' do
      doc = shell('')

      expect(response).to have_http_status(:ok)
      expect(doc.at_css('html')['lang']).to eq('ua')
      expect(doc.at_css('title').text).to eq('Zlata весільна мода')
      expect(doc.at_css('link[rel=canonical]')['href']).to eq('http://www.example.com/')
      hreflangs = doc.css('link[rel=alternate]').to_h { |link| [link['hreflang'], link['href']] }
      expect(hreflangs).to eq(
        'en' => 'http://www.example.com/en', 'ua' => 'http://www.example.com/ua', 'ru' => 'http://www.example.com/ru',
        'ro' => 'http://www.example.com/ro', 'x-default' => 'http://www.example.com/'
      )
    end

    it 'uses the URL locale for lang and strings' do
      doc = shell('/en/collections')

      expect(doc.at_css('html')['lang']).to eq('en')
      expect(doc.at_css('title').text).to eq('All Collections | Zlata wedding fashion')
      expect(doc.at_css('link[rel=canonical]')['href']).to eq('http://www.example.com/en/collections')
    end

    it 'covers accessories and contacts in all four locales' do
      %w[en ua ru ro].each do |locale|
        %w[accessories contacts].each do |page|
          doc = shell("/#{locale}/#{page}")

          expect(response).to have_http_status(:ok)
          expect(doc.at_css('html')['lang']).to eq(locale)
          expect(doc.at_css('title').text).to end_with(' | ' + I18n.t('seo.site_name', locale: locale))
        end
      end
    end
  end

  describe 'a collection page' do
    it 'renders title, plain-text description, Open Graph tags and hreflang' do
      doc = shell('/en/queen')

      expect(response).to have_http_status(:ok)
      expect(doc.at_css('title').text).to eq('Queen | Zlata wedding fashion')
      expect(meta(doc, 'meta[name=description]')).to eq('Dresses for queens')
      expect(meta(doc, 'meta[property="og:title"]')).to eq('Queen | Zlata wedding fashion')
      expect(meta(doc, 'meta[property="og:image"]')).to eq('https://img.example.test/collection.jpg')
      expect(meta(doc, 'meta[property="og:url"]')).to eq('http://www.example.com/en/queen')
      expect(doc.at_css('link[hreflang=ru]')['href']).to eq('http://www.example.com/ru/queen')
    end

    it 'keeps the unprefixed URL self-canonical' do
      doc = shell('/queen')

      expect(doc.at_css('link[rel=canonical]')['href']).to eq('http://www.example.com/queen')
      expect(doc.at_css('link[hreflang=x-default]')['href']).to eq('http://www.example.com/queen')
    end

    it 'answers 404 for an unknown or unpublished collection' do
      create_collection('Hidden', published: false)

      %w[/nope /en/nope /hidden].each do |path|
        doc = shell(path)

        expect(response).to have_http_status(:not_found), path
        expect(doc.at_css('div#app')).to be_present
        expect(meta(doc, 'meta[name=robots]')).to eq('noindex')
        expect(doc.at_css('link[rel=canonical]')).to be_nil
      end
    end
  end

  describe 'a product page' do
    it 'uses the cover image and the product description' do
      doc = shell('/en/queen/elayza')

      expect(response).to have_http_status(:ok)
      expect(doc.at_css('title').text).to eq('Elayza | Zlata wedding fashion')
      expect(meta(doc, 'meta[name=description]')).to eq('A very elegant dress')
      expect(meta(doc, 'meta[property="og:image"]')).to eq('https://img.example.test/cover.jpg')
      expect(doc.at_css('link[rel=canonical]')['href']).to eq('http://www.example.com/en/queen/elayza')
    end

    it 'answers 404 for an unknown or unpublished product, or a product of another collection' do
      create_product(collection, 'Secret', published: false)
      create_collection('King')

      %w[/queen/nope /queen/secret /king/elayza /queen/elayza/extra].each do |path|
        shell(path)

        expect(response).to have_http_status(:not_found), path
      end
    end

    it 'falls back to the name when there is no description' do
      create_product(collection, 'Plain', description: '')

      expect(meta(shell('/en/queen/plain'), 'meta[name=description]')).to eq('Plain')
    end
  end

  describe 'the HTML shell' do
    it 'loads the new app and is not cached' do
      shell('')

      expect(response.body).to match(%r{<script src="/build/assets/app-[^"]+\.js" type="module"})
      expect(response.headers['cache-control']).not_to include('immutable')
    end
  end

  describe 'GET /sitemap.xml' do
    it 'lists static pages, published collections and products with hreflang alternates' do
      create_collection('Hidden', published: false)
      create_product(collection, 'Secret', published: false)

      get '/sitemap.xml'

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq('application/xml')
      doc = Nokogiri::XML(response.body)
      doc.remove_namespaces!
      locs = doc.css('url > loc').map(&:text)
      expect(locs).to contain_exactly(
        'http://www.example.com/', 'http://www.example.com/collections', 'http://www.example.com/accessories',
        'http://www.example.com/contacts', 'http://www.example.com/queen', 'http://www.example.com/queen/elayza'
      )
      alternates = doc.css('url').find { |url| url.at_css('loc').text.end_with?('/queen/elayza') }.css('link')
      expect(alternates.map { |link| link['hreflang'] }).to eq(%w[en ua ru ro x-default])
    end
  end
end
