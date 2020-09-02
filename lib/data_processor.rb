class DataProcessor
  
  def import(json)
    return { message: 'Data is missing' } if json.nil? || json['data'].nil?

    # begin
      message = import_data(json['data'])
    # rescue Exception => ex
    #   message = ex.message
    # end

    { message: message }
  end

  def export
    {
      collections: Admin::Collection.all,
      colors: Admin::Color.all,
      contactGroups: Admin::ContactGroup.all,
      sizes: Admin::Size.all,
      sliders: Admin::Slider.all,
      socialNetworkings: Admin::SocialNetworking.all
    }
  end

  private

    def import_data(data)
      import_colors(data['colors'])                         unless data['colors'].nil?
      import_sizes(data['sizes'])                           unless data['sizes'].nil?
      import_collections(data['collections'])               unless data['collections'].nil?
      import_contact_groups(data['contactGroups'])          unless data['contactGroups'].nil?
      import_sliders(data['sliders'])                       unless data['sliders'].nil?
      import_social_networkings(data['socialNetworkings'])  unless data['socialNetworkings'].nil?
      'Import has been done successfully!'
    end

    def import_colors(colors)
      colors.each do |color|
        color['record'] = Admin::Color.find_or_create_by({ id: color['_id']['$oid']})
        color['record'].name = color['name'] || color['record'].name
        color['record'].save
      end
    end

    def import_sizes(sizes)
      sizes.each do |size|
        size['record'] = Admin::Size.find_or_create_by({ id: size['_id']['$oid']})
        size['record'].name = size['name'] || size['record'].name
        size['record'].save
      end
    end

    def import_collections(collections)
      collections.each do |collection|
        collection['record'] = Admin::Collection.find_or_create_by({ id: collection['_id']['$oid']})
        collection['record'].name = collection['name'] || collection['record'].name
        collection['record'].description = collection['description'] || collection['record'].description
        collection['record'].published = collection['published'] || collection['record'].published
        collection['record'].has_accessories = collection['has_accessories'] || collection['record'].has_accessories
        collection['record'].save

        unless collection['image'].nil?
          unless collection['record'].has_image?
            collection['record'].build_image({ id: collection['image']['_id']['$oid']})
          end
          collection['record'].image.url = collection['image']['url'] || collection['record'].image.url
          collection['record'].image.extension = collection['image']['extension'] || collection['record'].image.extension
          collection['record'].image.is_cover = collection['image']['is_cover'] || collection['record'].image.is_cover
          collection['record'].image.save
          collection['record'].save
        end

        unless collection['products'].nil?
          collection['products'].each do |product|
            productRecord = collection['record'].products.find_or_create_by({ id: product['_id']['$oid']})
            productRecord.name = product['name'] || productRecord.name
            productRecord.description = product['description'] || productRecord.description
            productRecord.published = product['published'] || productRecord.published
            productRecord.is_top = product['is_top'] || productRecord.is_top
            productRecord.size_ids = product['size_ids'] || productRecord.size_ids
            productRecord.color_ids = product['color_ids'] || productRecord.color_ids

            unless product['images'].nil?
              product['images'].each do |image|
                imageRecord = productRecord.images.find_or_create_by({ id: image['_id']['$oid'] })
                imageRecord.url = image['url'] || imageRecord.url
                imageRecord.extension = image['extension'] || imageRecord.extension
                imageRecord.is_cover = image['is_cover'] || imageRecord.is_cover
                imageRecord.save
              end
            end

            productRecord.save
          end
        end

        collection['record'].save
      end
    end

    def import_contact_groups(contactGroups)
      contactGroups.each do |contactGroup|
        contactGroup['record'] = Admin::ContactGroup.find_or_create_by({ id: contactGroup['_id']['$oid']})
        contactGroup['record'].name = contactGroup['name'] || contactGroup['record'].name
        contactGroup['record'].css_class = contactGroup['css_class'] || contactGroup['record'].css_class
        contactGroup['record'].published = contactGroup['published'] || contactGroup['record'].published
        contactGroup['record'].save

        unless contactGroup['contacts'].nil?
          contactGroup['contacts'].each do |contact|
            contactRecord = contactGroup['record'].contacts.find_or_create_by({ id: contact['_id']['$oid'] })
            contactRecord.name = contact['name'] || contactRecord.name
            contactRecord.published = contact['published'] || contactRecord.published
          end
        end

        contactGroup['record'].save
      end
    end

    def import_sliders(sliders)
      sliders.each do |slider|
        slider['record'] = Admin::Slider.find_or_create_by({ id: slider['_id']['$oid']})
        slider['record'].name = slider['name'] || slider['record'].name
        slider['record'].autoplay = slider['autoplay'] || slider['record'].autoplay
        slider['record'].published = slider['published'] || slider['record'].published
        slider['record'].save

        unless slider['slides'].nil?
          slider['slides'].each do |slide|
            slideRecord = slider['record'].slides.find_or_create_by({ id: slide['_id']['$oid'] })
            slideRecord.title = slide['title'] || slideRecord.title
            slideRecord.link_text = slide['link_text'] || slideRecord.link_text
            slideRecord.link_url = slide['link_url'] || slideRecord.link_url
            slideRecord.published = slide['published'] || slideRecord.published
            slideRecord.save

            unless slide['image'].nil?
              unless slideRecord.has_image?
                slideRecord.build_image({ id: slide['image']['_id']['$oid']})
              end
              slideRecord.image.url = slide['image']['url'] || slideRecord.image.url
              slideRecord.image.extension = slide['image']['extension'] || slideRecord.image.extension
              slideRecord.image.is_cover = slide['image']['is_cover'] || slideRecord.image.is_cover
              slideRecord.image.save
              slideRecord.save
            end

          end
        end

        slider['record'].save
      end
    end

    def import_social_networkings(socialNetworkings)
      socialNetworkings.each do |socialNetworking|
        socialNetworking['record'] = Admin::SocialNetworking.find_or_create_by({ id: socialNetworking['_id']['$oid']})
        socialNetworking['record'].name = socialNetworking['name'] || socialNetworking['record'].name
        socialNetworking['record'].url = socialNetworking['url'] || socialNetworking['record'].url
        socialNetworking['record'].css_class = socialNetworking['css_class'] || socialNetworking['record'].css_class
        socialNetworking['record'].published = socialNetworking['published'] || socialNetworking['record'].published
        socialNetworking['record'].save
      end
    end
end