import 'owl.carousel';
import './style.styl';
import template from './template.html';

class SliderController {
  constructor($timeout, sliderService) {
    this.$timeout = $timeout;
    this.sliderService = sliderService;
  }

  $onInit() {
    this.loadSlider();
  }

  loadSlider() {
    this.isLoadingSpinner = true;

    this.sliderService.home((response) => {
      this.slider = response.slider || {};
      this.$timeout(() => {
        this.isLoadingSpinner = false;
        this.createCarousel();
      }, 50);
    });
  }

  createCarousel() {
    $('.owl-carousel').owlCarousel({
      items: 1,
      loop: true,
      margin: 0,
      lazyLoad: true,
      responsiveClass: true,
      nav: true,
      dots: true,
      smartSpeed: 500,
      autoplay: this.slider.autoplay,
      autoplayTimeout: 5000,
      autoplayHoverPause: true,
      navText: [
        "<i class='ti-arrow-left owl-direction'></i>",
        "<i class='ti-arrow-right owl-direction'></i>"
      ],
      responsive: {
          0: {
            items: 1,
            nav: true
          },
          600: {
            items: 1,
            nav: true
          },
          1000: {
            items: 1,
            nav: true
          }
      }
    });

  }
}

let slider = {
  bindings: {},
  controller: SliderController,
  templateUrl: template
};

export default slider