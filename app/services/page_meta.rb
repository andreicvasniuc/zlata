# Resolves a public URL path to the meta data of the HTML shell: title, description, Open Graph image, canonical URL,
# hreflang alternates, the price of a product (Open Graph and schema.org JSON-LD) and the HTTP status (404 for an unknown or unpublished collection/product).
#
# Paths: `/(:locale)`, `/collections`, `/accessories`, `/contacts`, `/:collection`, `/:collection/:product`.
# One query per request, and only for collection and product pages.
class PageMeta
  LOCALES = %w[en ua ru ro].freeze
  DEFAULT_LOCALE = "ua".freeze
  SECTIONS = { "collections" => "all_collections", "accessories" => "all_accessories", "contacts" => "contacts" }.freeze
  DESCRIPTION_LENGTH = 200

  Result = Struct.new(:status, :locale, :title, :description, :image, :canonical, :alternates, :robots,
                      :price, :currency, :json_ld, keyword_init: true)

  # `path` is the request path without any preview prefix; `base_url` is e.g. "https://zlata-weddingfashion.com".
  def initialize(path, base_url:)
    @base_url = base_url
    segments = path.to_s.split("/").reject(&:blank?)
    @locale = LOCALES.include?(segments.first) ? segments.shift : nil
    @segments = segments
  end

  def call
    I18n.with_locale(locale) do
      page = resolve
      page ? found(page) : not_found
    end
  end

  private

    attr_reader :base_url, :segments

    def locale
      (@locale || DEFAULT_LOCALE).to_sym
    end

    def site_name
      I18n.t("seo.site_name")
    end

    # { title:, description:, image: } for a known page, nil for an unknown one
    def resolve
      case segments
      in [] then { title: site_name, description: site_name }
      in [section] if SECTIONS.key?(section) then section_page(section)
      in [collection_slug] then collection_page(collection_slug)
      in [collection_slug, product_slug] then product_page(collection_slug, product_slug)
      else nil
      end
    end

    def section_page(section)
      title = I18n.t("seo.#{SECTIONS.fetch(section)}")
      { title: "#{title} | #{site_name}", description: "#{site_name}: #{title}" }
    end

    def collection_page(slug)
      collection = find_collection(slug)
      return unless collection

      { title: "#{collection.name} | #{site_name}", description: describe(collection.description, collection.name),
        image: collection.image&.url }
    end

    def product_page(collection_slug, product_slug)
      collection = find_collection(collection_slug)
      product = collection&.products&.to_a&.find { |item| item.published && item._slugs.include?(product_slug) }
      return unless product

      images = product.images.to_a
      cover = images.find(&:is_cover) || images.first
      page = { title: "#{product.name} | #{site_name}", description: describe(product.description, product.name), image: cover&.url }
      page.merge!(price: product.price, currency: product.currency, json_ld: product_json_ld(product, page)) if product.price
      page
    end

    # schema.org Product with an AggregateOffer: the price is a "from" price
    def product_json_ld(product, page)
      {
        "@context" => "https://schema.org",
        "@type" => "Product",
        "name" => product.name,
        "description" => page[:description],
        "image" => page[:image],
        "url" => url_for_path(@locale),
        "offers" => { "@type" => "AggregateOffer", "lowPrice" => product.price, "priceCurrency" => product.currency }
      }.compact
    end

    def find_collection(slug)
      Collection.published.where(_slugs: slug).only(:name, :description, :_slugs, :image, :products).first
    end

    def describe(text, fallback)
      text = ActionController::Base.helpers.strip_tags(text.to_s).squish
      text = fallback if text.blank?
      text.truncate(DESCRIPTION_LENGTH, separator: " ")
    end

    def found(page)
      Result.new(status: :ok, locale: locale, title: page[:title], description: page[:description], image: page[:image],
                 canonical: url_for_path(@locale), alternates: alternates, robots: nil,
                 price: page[:price], currency: page[:currency], json_ld: page[:json_ld])
    end

    def not_found
      Result.new(status: :not_found, locale: locale, title: "#{I18n.t('seo.not_found')} | #{site_name}",
                 description: nil, image: nil, canonical: nil, alternates: {}, robots: "noindex")
    end

    # The unprefixed URL is the default (x-default); every locale also has a prefixed URL.
    def alternates
      LOCALES.to_h { |code| [code, url_for_path(code)] }.merge("x-default" => url_for_path(nil))
    end

    def url_for_path(prefix)
      "#{base_url}/#{[prefix, *segments].compact.join('/')}"
    end
end
