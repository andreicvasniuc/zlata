class ContactController {
  constructor($timeout, $translate, titleTranslateId, contactGroupService, breadcrumbService) {
    this.$timeout = $timeout;
    this.contactGroupService = contactGroupService;
    this.breadcrumbService = breadcrumbService;
    
    this.getTranslation($translate, titleTranslateId);
    this.loadContacts();
  }

  loadContacts() {
    this.isLoadingSpinner = true;

    this.contactGroupService.list((response) => {
      this.contactGroups = response.contact_groups || [];
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