class SocialNetworkingNotifier {
  constructor(notifier) {
    this.notifier = notifier;
    this.item = 'SOCIAL_NETWORKING';
  }

  showSuccessSaveMessage() {
    this.notifier.showSuccessSaveMessage(this.item, true);
  }

  showSuccessCreateMessage() {
    this.notifier.showSuccessCreateMessage(this.item, true);
  }

  showSuccessUpdateMessage() {
    this.notifier.showSuccessUpdateMessage(this.item, true);
  }

  showSuccessDeleteMessage() {
    this.notifier.showSuccessDeleteMessage(this.item, true);
  }

  showSuccessPublishedMessage(published) {
    this.notifier.success(`${this.item} WAS_ ${published ? "" : "UN"}PUBLISHED_ SUCCESSFULLY`); 
  }
}

export default SocialNetworkingNotifier