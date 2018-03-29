class SliderService {
  constructor(sliderResource, localeService) {
    this.sliderResource = sliderResource;
    this.localeService = localeService;
  }

  home(successCallback, errorCallback) {
    this.sliderResource.home({ locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default SliderService