class SlideService {
  constructor(slideResource, requestService, slideRouter, localeService) {
    this.slideResource = slideResource;
    this.requestService = requestService;
    this.slideRouter = slideRouter;
    this.localeService = localeService;
  }

  get(slide, successCallback, errorCallback) {
    this.slideResource.get({ id: slide.slug, sliderId: this.slideRouter.getSliderId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  add(slide, successCallback, errorCallback) {
    this.slideResource.save({ slide: slide, sliderId: this.slideRouter.getSliderId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  edit(slide, successCallback, errorCallback) {
    this.slideResource.update({ id: slide.slug, slide: slide, sliderId: this.slideRouter.getSliderId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  delete(slide, successCallback, errorCallback) {
    this.slideResource.remove({ id: slide.slug, sliderId: this.slideRouter.getSliderId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default SlideService