import template from './template.html';

class BreadcrumbController {
  constructor() {
  }
}

let breadcrumb = {
  bindings: {
    data: '<'
  },
  controller: BreadcrumbController,
  templateUrl: template
};

export default breadcrumb