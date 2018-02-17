class ContactService {
  constructor(contactResource, requestService, contactRouter, localeService) {
    this.contactResource = contactResource;
    this.requestService = requestService;
    this.contactRouter = contactRouter;
    this.localeService = localeService;
  }

  get(contact, successCallback, errorCallback) {
    this.contactResource.get({ id: contact.slug, contactGroupId: this.contactRouter.getContactGroupId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  add(contact, successCallback, errorCallback) {
    this.contactResource.save({ contact: contact, contactGroupId: this.contactRouter.getContactGroupId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  edit(contact, successCallback, errorCallback) {
    this.contactResource.update({ id: contact.slug, contact: contact, contactGroupId: this.contactRouter.getContactGroupId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }

  delete(contact, successCallback, errorCallback) {
    this.contactResource.remove({ id: contact.slug, contactGroupId: this.contactRouter.getContactGroupId(), locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default ContactService