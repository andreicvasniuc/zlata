class ContactController {
  constructor($timeout, $translate, titleTranslateId, breadcrumbService) {
    this.$timeout = $timeout;
    this.breadcrumbService = breadcrumbService;
    
    this.getTranslation($translate, titleTranslateId);
    // this.loadContacts();
  }

  loadContacts() {
    this.isLoadingSpinner = true;

    this.contactService.get((response) => {
      // this.products = response.products || [];
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