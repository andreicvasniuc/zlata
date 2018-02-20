import template from './template.html';

class MainLayoutController {
  constructor() {}
}

let mainLayout = {
  bindings: {
    breadcrumb: '<',
    isLoadingSpinner: '<',
    heading: '<',
    centered: '<'
  },
  controller: MainLayoutController,
  templateUrl: template,
  transclude: true
};

export default mainLayout