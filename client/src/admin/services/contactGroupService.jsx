class ContactGroupService {
  constructor(contactGroupResource, localeService) {
    this.contactGroupResource = contactGroupResource;
    this.localeService = localeService;
  }

  search(request, successCallback, errorCallback){
    request.locale = this.localeService.get();
    this.contactGroupResource.search(request, successCallback, errorCallback);
  }

  list(successCallback, errorCallback){
    this.contactGroupResource.list({ locale: this.localeService.get() }, successCallback, errorCallback);
  }

  get(id, successCallback, errorCallback) {
    this.contactGroupResource.get({ id: id, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  add(contactGroup, successCallback, errorCallback) {
    this.contactGroupResource.save({ contact_group: contactGroup, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  edit(contactGroup, successCallback, errorCallback) {
    this.contactGroupResource.update({ id: contactGroup.slug, contact_group: contactGroup, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  delete(contactGroup, successCallback, errorCallback){
    this.contactGroupResource.remove({ id: contactGroup.slug, locale: this.localeService.get() }, successCallback, errorCallback);
  }

  getCssClasses() {
    return [
      { name: 'Mobile', id: 'ti-mobile' },
      { name: 'Viber', id: 'ti-viber' },
      { name: 'Email', id: 'ti-email' },
      { name: 'Skype', id: 'ti-skype' }
    ];
  }
}

export default ContactGroupService