import './style.styl';

import template from './template.html';

class ItemDetailsController {
  constructor() {
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