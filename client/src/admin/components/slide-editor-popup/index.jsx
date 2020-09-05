import template from './template.html';
import closeIcon from 'images/close.png';

class SlideEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, slideService, slideNotifier, imageNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.slideService = slideService;
    this.slideNotifier = slideNotifier;
    this.imageNotifier = imageNotifier;
    this.closeIcon = closeIcon;

    this.tabs = {
      basicInformation: 0,
      imageUploading: 1
    };
  }

  $onInit() {
    this.createOpenPopupEvent();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSlideEditorPopup', (event, slide, openImageUploadingTab) => {
      let activeTab = openImageUploadingTab ? this.tabs.imageUploading : this.tabs.basicInformation;
      this.initialize(slide, activeTab);
      this.stopSavingSpinner();
      this.openSlideEditorPopup(); 
    });
  }

  initialize(slide, activeTab) {
    this.slide = slide;
    this.isEdit = !!slide;
    this.selectTab(activeTab);
  }

  openSlideEditorPopup() {
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
    this.slideService.add(this.slide, (response) => {
      this.initialize(response, this.activeTab);
      this.slideNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
      this.selectTab(this.tabs.imageUploading);
    });
  }

  edit() {
    this.startSavingSpinner();
    this.slideService.edit(this.slide, (response) => {
      this.slideNotifier.showSuccessUpdateMessage();
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

  selectTab(tab) {
    this.activeTab = tab;
  }

  isCurrentTab(tab) {
    return this.activeTab == tab;
  }

  uploadImage() {
    this.slideService.uploadImage(this.slide, (response) => {
      this.imageNotifier.showSuccessUploadMessage();
    });
  }

  deleteImage() {
    delete this.slide.image;
  }
}

let slideEditorPopup = {
  bindings: {},
  controller: SlideEditorPopupController
};

export default slideEditorPopup