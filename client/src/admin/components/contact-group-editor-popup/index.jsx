import './style.styl';

import template from './template.html';
import closeIcon from 'images/close.png';

class ContactGroupEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, contactGroupService, contactGroupNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.contactGroupService = contactGroupService;
    this.contactGroupNotifier = contactGroupNotifier;
    this.closeIcon = closeIcon;

    this.createOpenPopupEvent();
    this.createContactGroupCssClasses();
  }

  createContactGroupCssClasses() {
    this.contactGroupCssClasses = this.contactGroupService.getCssClasses();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openContactGroupEditorPopup', (event, contactGroup) => {
      this.initialize(contactGroup);
      this.stopSavingSpinner();
      this.openContactGroupEditorPopup(); 
    });
  }

  initialize(contactGroup) {
    this.contactGroup = contactGroup;
    this.isEdit = !!contactGroup;
  }

  openContactGroupEditorPopup() {
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
    this.contactGroupService.add(this.contactGroup, (response) => {
      this.initialize(response);
      this.contactGroupNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
    });
  }

  edit() {
    this.startSavingSpinner();
    this.contactGroupService.edit(this.contactGroup, (response) => {
      this.contactGroupNotifier.showSuccessUpdateMessage();
      this.stopSavingSpinner();
      this.close();
    });
  }

  reloadGrid() {
    this.$scope.$emit('reloadGrid');
  }

  close() {
    this.reloadGrid();
    this.modal.dismiss('cancel');
  }
}

let contactGroupEditorPopup = {
  bindings: {},
  controller: ContactGroupEditorPopupController
};

export default contactGroupEditorPopup