import template from './template.html';

class BreadcrumbController {
  constructor() {
  }
}

let breadcrumb = {
  bindings: {
    currentPage: '<'
  },
  controller: BreadcrumbController,
  templateUrl: template
};

export default breadcrumb