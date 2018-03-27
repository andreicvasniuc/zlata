class Admin::SlideImage < Admin::Image
  embedded_in :slide, class_name: "Admin::Slide"
end