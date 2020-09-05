import template from './template.html';
import closeIcon from 'images/close.png';

class SliderEditorPopupController {
  constructor($scope, $timeout, $uibModal, $translate, sliderService, sliderNotifier) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.$translate = $translate;
    this.sliderService = sliderService;
    this.sliderNotifier = sliderNotifier;
    this.closeIcon = closeIcon;
  }

  $onInit() {
    this.createOpenPopupEvent();
  }

  createOpenPopupEvent() {
    this.$scope.$on('openSliderEditorPopup', (event, slider) => {
      this.initialize(slider);
      this.stopSavingSpinner();
      this.openSliderEditorPopup(); 
    });
  }

  initialize(slider) {
    this.slider = slider;
    this.isEdit = !!slider;
  }

  openSliderEditorPopup() {
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
    this.sliderService.add(this.slider, (response) => {
      this.initialize(response);
      this.sliderNotifier.showSuccessCreateMessage();
      this.stopSavingSpinner();
    });
  }

  edit() {
    this.startSavingSpinner();
    this.sliderService.edit(this.slider, (response) => {
      this.sliderNotifier.showSuccessUpdateMessage();
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

let sliderEditorPopup = {
  bindings: {},
  controller: SliderEditorPopupController
};

export default sliderEditorPopup