import template from './template.html';
import closeIcon from 'images/close.png';

class ContactEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, contactService, contactNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.contactService = contactService;
    this.contactNotifier = contactNotifier;
    this.closeIcon = closeIcon;
  }
  
  $onInit() {
    this.createOpenPopupEvent();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openContactEditorPopup', (event, contact) => {
      this.initialize(contact);
      this.stopSavingSpinner();
      this.openContactEditorPopup(); 
    });
  }

  initialize(contact) {
    this.contact = contact;
    this.isEdit = !!contact;
  }

  openContactEditorPopup() {
    this.modal = this.$uibModal.open({
      templateUrl: template,
      scope: this.$scope,
      backdrop: 'static',
      keyboard: false
    });
  }

  startSavingSpinner() { this.isSavingSpinner = true; }
  stopSavingSpinner() { this.isSavingSpinner = false; }

  add() {
    this.startSavingSpinner();
    this.contactService.add(this.contact, (response) => {
      this.initialize(response);
      this.contactNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
    });
  }

  edit() {
    this.startSavingSpinner();
    this.contactService.edit(this.contact, (response) => {
      this.contactNotifier.showSuccessUpdateMessage();
      this.stopSavingSpinner();
      this.close();
    });
  }

  reloadGrid() {
    this.$scope.$emit('reloadGrid');
  }

  close() {
    this.reloadGrid();
    this.modal.close();
  }
}

let contactEditorPopup = {
  bindings: {},
  controller: ContactEditorPopupController
};

export default contactEditorPopup