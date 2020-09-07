import './style.styl';

import template from './template.html';

class ItemDetailsController {
  constructor($scope) {
    this.$scope = $scope;
  }

  clickOnItem() {
    this.listener = this.$scope.$on('$locationChangeStart', (event, next, current) => {
         event.preventDefault();
         this.closeGallery();
         this.listener();
    });
  }

  closeGallery() {
    window.lgData['lg' + (window.lgData.uid -1)].destroy();
  }
}

let itemDetails = {
  bindings: {
    item: '<'
  },
  controller: ItemDetailsController,
  templateUrl: template,
  transclude: true
};

export default itemDetails