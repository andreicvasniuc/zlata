import template from './template.html';

class MainContainerController {
  constructor() {}
}

let mainContainer = {
  bindings: {
    breadcrumb: '<'
  },
  controller: MainContainerController,
  templateUrl: template,
  transclude: true
};

export default mainContainer