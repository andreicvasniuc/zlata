import template from './template.html';
import closeIcon from 'images/close.png';

class ContactGroupSelectorPopupController {
  constructor($scope, $uibModal, $translate, contactGroupService, router, routeUrls, contactRouter) {
    this.$scope = $scope;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.contactGroupService = contactGroupService;
    this.router = router;
    this.contactRouter = contactRouter;
    this.routeUrls = routeUrls;
    this.closeIcon = closeIcon;
  }

  $onInit() {
    this.createOpenPopupEvent();
    this.loadContactGroups();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openContactGroupSelector', (event) => this.openContactGroupSelectorPopup());
  }

  openContactGroupSelectorPopup() {
    this.modal = this.$uibModal.open({
      templateUrl: template,
      scope: this.$scope,
      backdrop: 'static',
      keyboard: false
    });
  }

  select(contactGroup, event) {
    event.preventDefault();
    this.close();
    this.contactRouter.goTo(this.routeUrls.contact_group_contacts, contactGroup.slug);
  }

  close() {
    this.modal.close();
  }

  loadContactGroups(successCallback) {
    this.isLoadingSpinner = true;

    this.contactGroupService.list((response) => {
        this.contactGroups = response.contactGroups;
        this.isLoadingSpinner = false;
        if(successCallback) successCallback();
      }, 
      () => { console.log('error'); });
  }

  goToContactGroups() {
    this.close();
    this.router.goTo(this.routeUrls.contact_groups);
  }
}

let contactGroupSelectorPopup = {
  bindings: {},
  controller: ContactGroupSelectorPopupController
};

export default contactGroupSelectorPopup