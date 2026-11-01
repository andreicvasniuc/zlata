# GET /sitemap.xml: the home page, the static pages, every published collection and product, with hreflang alternates.
class SitemapsController < ApplicationController
  STATIC_PATHS = ["", "collections", "accessories", "contacts", "about"].freeze

  def show
    expires_in 1.hour, public: true
    render xml: build_xml
  end

  private

    def build_xml
      builder = Nokogiri::XML::Builder.new(encoding: "UTF-8") do |xml|
        xml.urlset(xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9", "xmlns:xhtml" => "http://www.w3.org/1999/xhtml") do
          entries.each { |path, lastmod| url(xml, path, lastmod) }
        end
      end
      builder.to_xml
    end

    def entries
      list = STATIC_PATHS.map { |path| [path, nil] }
      Collection.published.only(:_slugs, :updated_at, "products._slugs", "products.published", "products.updated_at").each do |collection|
        list << [collection.slug, collection.updated_at]
        collection.products.select(&:published).each { |product| list << ["#{collection.slug}/#{product.slug}", product.updated_at] }
      end
      list
    end

    def url(xml, path, lastmod)
      xml.url do
        xml.loc location(nil, path)
        xml.lastmod lastmod.utc.iso8601 if lastmod
        PageMeta::LOCALES.each { |code| xml["xhtml"].link(rel: "alternate", hreflang: code, href: location(code, path)) }
        xml["xhtml"].link(rel: "alternate", hreflang: "x-default", href: location(nil, path))
      end
    end

    def location(locale, path)
      "#{request.base_url}/#{[locale, path.presence].compact.join('/')}"
    end
end
