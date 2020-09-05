import template from './template.html';
import closeIcon from 'images/close.png';

class SliderSelectorPopupController {
  constructor($scope, $uibModal, $translate, sliderService, router, routeUrls, slideRouter) {
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.sliderService = sliderService;
    this.router = router;
    this.slideRouter = slideRouter;
    this.routeUrls = routeUrls;
    this.closeIcon = closeIcon;
  }

  $onInit() {
    this.createOpenPopupEvent();
    this.loadSliders();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSliderSelector', (event) => this.openSliderSelectorPopup());
  }

  openSliderSelectorPopup() {
    this.modal = this.$uibModal.open({
      templateUrl: template,
      scope: this.$scope,
      backdrop: 'static',
      keyboard: false
    });
  }

  select(slider, event) {
    event.preventDefault();
    this.close();
    this.slideRouter.goTo(this.routeUrls.slider_slides, slider.slug);
  }

  close() {
    this.modal.close();
  }

  loadSliders(successCallback) {
    this.isLoadingSpinner = true;

    this.sliderService.list((response) => {
        this.sliders = response.sliders;
        this.isLoadingSpinner = false;
        if(successCallback) successCallback();
      }, 
      () => { console.log('error'); });
  }

  goToSlides() {
    this.close();
    this.router.goTo(this.routeUrls.sliders);
  }
}

let sliderSelectorPopup = {
  bindings: {},
  controller: SliderSelectorPopupController
};

export default sliderSelectorPopup