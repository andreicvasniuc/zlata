import './style.styl';

import template from './template.html';
import closeIcon from 'images/close.png';

class SlideEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, slideService, slideNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.slideService = slideService;
    this.slideNotifier = slideNotifier;
    this.closeIcon = closeIcon;

    this.createOpenPopupEvent();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSlideEditorPopup', (event, slide) => {
      this.initialize(slide);
      this.stopSavingSpinner();
      this.openSlideEditorPopup(); 
    });
  }

  initialize(slide) {
    this.slide = slide;
    this.isEdit = !!slide;
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
      this.initialize(response);
      this.slideNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
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
    this.modal.dismiss('cancel');
  }
}

let slideEditorPopup = {
  bindings: {},
  controller: SlideEditorPopupController
};

export default slideEditorPopup