class ContactNotifier {
  constructor(notifier) {
    this.notifier = notifier;
    this.item = 'CONTACT';
  }

  showSuccessSaveMessage() {
    this.notifier.showSuccessSaveMessage(this.item);
  }

  showSuccessCreateMessage() {
    this.notifier.showSuccessCreateMessage(this.item);
  }

  showSuccessUpdateMessage() {
    this.notifier.showSuccessUpdateMessage(this.item);
  }

  showSuccessDeleteMessage() {
    this.notifier.showSuccessDeleteMessage(this.item);
  }

  showSuccessPublishedMessage(published) {
    this.notifier.success(`CONTACT WAS ${published ? "" : "UN"}PUBLISHED SUCCESSFULLY`); 
  }
}

export default ContactNotifier