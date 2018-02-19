import './style.styl';
import template from './template.html';

class ContactGroupsController {
  constructor() {}
}

let contactGroups = {
  bindings: {
    list: '<'
  },
  controller: ContactGroupsController,
  templateUrl: template
};

export default contactGroups