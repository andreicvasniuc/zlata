class SliderService {
  constructor(sliderResource, localeService) {
    this.sliderResource = sliderResource;
    this.localeService = localeService;
  }

  search(request, successCallback, errorCallback){
    request.locale = this.localeService.get();
    this.sliderResource.search(request, successCallback, errorCallback);
  }

  list(successCallback, errorCallback){
    this.sliderResource.list({ locale: this.localeService.get() }, successCallback, errorCallback);
  }

  get(id, successCallback, errorCallback) {
    this.sliderResource.get({ id: id, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  add(slider, successCallback, errorCallback) {
    this.sliderResource.save({ slider: slider, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  edit(slider, successCallback, errorCallback) {
    this.sliderResource.update({ id: slider.slug, slider: slider, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  delete(slider, successCallback, errorCallback){
    this.sliderResource.remove({ id: slider.slug, locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default SliderService