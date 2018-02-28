class ContactService {
  constructor(contactResource, localeService) {
    this.contactResource = contactResource;
    this.localeService = localeService;
  }

  send(contact, successCallback, errorCallback){
    this.contactResource.send({ contact: contact, locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default ContactService