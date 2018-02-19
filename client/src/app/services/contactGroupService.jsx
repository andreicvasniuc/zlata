class ContactGroupService {
  constructor(contactGroupResource, localeService) {
    this.contactGroupResource = contactGroupResource;
    this.localeService = localeService;
  }

  list(successCallback, errorCallback){
    this.contactGroupResource.list({ locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default ContactGroupService