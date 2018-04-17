import template from './template.html';

class ExtraFieldController {
  constructor() {
  }
}

let extraField = {
  bindings: {
    label: '@',
    items: '<'
  },
  controller: ExtraFieldController,
  templateUrl: template
};

export default extraField