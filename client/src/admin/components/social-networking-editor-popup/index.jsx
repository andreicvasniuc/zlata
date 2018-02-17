import './style.styl';

import template from './template.html';
import closeIcon from 'images/close.png';

class SocialNetworkingEditorPopupController {
  constructor($scope, $timeout, $uibModal, socialNetworkingService, socialNetworkingNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.socialNetworkingService = socialNetworkingService;
    this.socialNetworkingNotifier = socialNetworkingNotifier;
    this.closeIcon = closeIcon;

    this.createOpenPopupEvent();
    this.createSocialNetworkingCssClasses();
  }

  createSocialNetworkingCssClasses() {
    this.socialNetworkingCssClasses = this.socialNetworkingService.getCssClasses();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSocialNetworkingEditorPopup', (event, socialNetworking) => {
      this.initialize(socialNetworking);
      this.stopSavingSpinner();
      this.openSocialNetworkingEditorPopup(); 
    });
  }

  initialize(socialNetworking) {
    this.socialNetworking = socialNetworking;
    this.isEdit = !!socialNetworking;
  }

  openSocialNetworkingEditorPopup() {
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
    this.socialNetworkingService.add(this.socialNetworking, (response) => {
      this.initialize(response);
      this.socialNetworkingNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
    });
  }

  edit() {
    this.startSavingSpinner();
    this.socialNetworkingService.edit(this.socialNetworking, (response) => {
      this.socialNetworkingNotifier.showSuccessUpdateMessage();
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

let socialNetworkingEditorPopup = {
  bindings: {},
  controller: SocialNetworkingEditorPopupController
};

export default socialNetworkingEditorPopup