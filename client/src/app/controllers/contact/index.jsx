class ContactController {
  constructor($timeout, $translate, titleTranslateId, contactService, breadcrumbService) {
    this.$timeout = $timeout;
    this.contactService = contactService;
    this.breadcrumbService = breadcrumbService;
    
    this.getTranslation($translate, titleTranslateId);
    this.loadContacts();
  }

  loadContacts() {
    this.isLoadingSpinner = true;

    this.contactService.list((response) => {
      this.contacts = response.contacts || [];
      this.$timeout(() => this.isLoadingSpinner = false, 50);
    });
  }

  getTranslation($translate, titleTranslateId) {
    $translate(titleTranslateId).then((translation) => {
      this.title = translation;
      this.breadcrumb = this.breadcrumbService.createBreadcrumb(this.title);
    });
  }
}

export default ContactController