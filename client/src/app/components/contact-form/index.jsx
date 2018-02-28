import './style.styl';
import template from './template.html';

class ContactFormController {
  constructor(notifier, contactService) {
    this.notifier = notifier;
    this.contactService = contactService;
  }

  send() {
    if(this.form.$invalid) return;

    this.isSending = true;
    this.contactService.send(this.contact, (response) => {
      this.notifier.success('MESSAGE_SENT');
      this.contact = null;
      this.isSending = false;
    });
  }
}

let contactForm = {
  bindings: {},
  controller: ContactFormController,
  templateUrl: template
};

export default contactForm