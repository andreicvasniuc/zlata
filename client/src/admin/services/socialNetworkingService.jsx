class SocialNetworkingService {
  constructor(socialNetworkingResource, localeService) {
    this.socialNetworkingResource = socialNetworkingResource;
    this.localeService = localeService;
  }

  search(request, successCallback, errorCallback){
    request.locale = this.localeService.get();
    this.socialNetworkingResource.search(request, successCallback, errorCallback);
  }

  get(id, successCallback, errorCallback) {
    this.socialNetworkingResource.get({ id: id, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  add(socialNetworking, successCallback, errorCallback) {
    this.socialNetworkingResource.save({ social_networking: socialNetworking, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  edit(socialNetworking, successCallback, errorCallback) {
    this.socialNetworkingResource.update({ id: socialNetworking.slug, social_networking: socialNetworking, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  delete(socialNetworking, successCallback, errorCallback){
    this.socialNetworkingResource.remove({ id: socialNetworking.slug, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  uploadImage(socialNetworking, successCallback, errorCallback){
    this.socialNetworkingResource.uploadImage({ id: socialNetworking.slug, image: socialNetworking.image, locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default SocialNetworkingService