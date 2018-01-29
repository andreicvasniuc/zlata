import template from './template.html';

class MainFooterController {
  constructor() {
    this.currentYear = new Date().getFullYear();
  }
}

let mainFooter = {
  bindings: {},
  controller: MainFooterController,
  templateUrl: template
};

export default mainFooter