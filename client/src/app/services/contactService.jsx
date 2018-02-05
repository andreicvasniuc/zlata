class ContactService {
  constructor(contactResource, localeService) {
    this.contactResource = contactResource;
    this.localeService = localeService;
  }

  list(successCallback, errorCallback){
    this.contactResource.list({ locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default ContactService