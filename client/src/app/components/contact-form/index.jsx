import './style.styl';
import template from './template.html';

class ContactFormController {
  constructor(notifier) {
    this.notifier = notifier;
  }

  send() {
    if(this.form.$invalid) return;

    console.log('this.contact', this.contact, this.form);
    this.notifier.success('MESSAGE_SENT');
    this.contact = null;
  }
}

let contactForm = {
  bindings: {},
  controller: ContactFormController,
  templateUrl: template
};

export default contactForm