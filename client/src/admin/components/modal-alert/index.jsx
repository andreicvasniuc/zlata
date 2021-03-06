import './style.styl';

import template from './template.html';

class ModalAlertController {
  constructor($scope, $uibModal) {
    this.$scope = $scope;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.$scope.$on('openModalAlert', (event, config) => {
      this.config = config;
      this.createCallbacks();
      this.openModalAlert(); 
    });
  }

  createCallbacks() {
    this.config.buttons.forEach((button) => {
      button.scopeCallback = () => {
        if (button.callback) button.callback(this.config);
        this.close();
      };
    });
  }

  openModalAlert() {
    this.modal = this.$uibModal.open({
      templateUrl: template,
      scope: this.$scope,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-alert'
    });
  }

  close() {
    this.modal.close();
  }
}

let modalAlert = {
  bindings: {},
  controller: ModalAlertController,
  templateUrl: template
};

export default modalAlert