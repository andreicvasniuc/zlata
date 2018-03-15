import template from './template.html';

class SliderController {
  constructor($timeout) {
    this.createIconList();
    $timeout(() => this.createCarousel(), 50);
  }

  createIconList() {
    let slide1Image = 'https://pp.userapi.com/c844617/v844617416/2c96/YFegKFAv7U8.jpg';
    let slide2Image = 'https://pp.userapi.com/c844617/v844617416/2cd3/uTartb_WFHQ.jpg';
    let slide3Image = 'https://pp.userapi.com/c844617/v844617416/2cc9/IJC5fLT2opQ.jpg';
    this.iconList = [slide1Image, slide2Image, slide3Image];
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