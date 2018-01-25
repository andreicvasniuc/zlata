import './style.styl';

import template from './template.html';
import closeIcon from 'images/close.png';

class SocialNetworkingEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, socialNetworkingService, socialNetworkingNotifier, imageNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.socialNetworkingService = socialNetworkingService;
    this.socialNetworkingNotifier = socialNetworkingNotifier;
    this.imageNotifier = imageNotifier;
    this.closeIcon = closeIcon;

    this.tabs = {
      basicInformation: 0,
      imageUploading: 1
    };

    this.createOpenPopupEvent();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSocialNetworkingEditorPopup', (event, socialNetworking, openImageUploadingTab) => {
      let activeTab = openImageUploadingTab ? this.tabs.imageUploading : this.tabs.basicInformation;
      this.initialize(socialNetworking, activeTab);
      this.stopSavingSpinner();
      this.openSocialNetworkingEditorPopup(); 
    });
  }

  initialize(socialNetworking, activeTab) {
    this.socialNetworking = socialNetworking;
    this.isEdit = !!socialNetworking;
    this.selectTab(activeTab);
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
      this.initialize(response, this.activeTab);
      this.socialNetworkingNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
      this.selectTab(this.tabs.imageUploading);
    });
  }

  edit() {
    this.startSavingSpinner();
    this.socialNetworkingService.edit(this.socialNetworking, (response) => {
      this.socialNetworkingNotifier.showSuccessUpdateMessage();
      this.stopSavingSpinner();
    });
  }

  reloadGrid() {
    this.$scope.$emit('reloadGrid');
  }

  cancel() {
    this.reloadGrid();
    this.modal.dismiss('cancel');
  }

  selectTab(tab) {
    this.activeTab = tab;
  }

  isCurrentTab(tab) {
    return this.activeTab == tab;
  }

  uploadImage() {
    this.socialNetworkingService.uploadImage(this.socialNetworking, (response) => {
      this.imageNotifier.showSuccessUploadMessage();
    });
  }

  deleteImage() {
    delete this.socialNetworking.image;
  }
}

let socialNetworkingEditorPopup = {
  bindings: {},
  controller: SocialNetworkingEditorPopupController
};

export default socialNetworkingEditorPopup