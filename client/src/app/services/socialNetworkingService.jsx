class SocialNetworkingService {
  constructor(socialNetworkingResource, localeService) {
    this.socialNetworkingResource = socialNetworkingResource;
    this.localeService = localeService;
  }

  list(successCallback, errorCallback) {
    return this.socialNetworkingResource.list({ locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default SocialNetworkingService