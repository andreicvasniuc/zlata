class Admin::SocialNetworkingImage < Admin::Image
  embedded_in :social_networking, class_name: "Admin::SocialNetworking"
end