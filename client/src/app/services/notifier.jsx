class Notifier {
  constructor(toastr, $translate) {
    this.toastr = toastr;
    this.$translate = $translate;
  }

  success(message) {
    this.$translate(message).then((translation) => this.toastr.success(translation));
  }

  error(message) {
    this.$translate(message).then((translation) => this.toastr.error(translation));
  }
}

export default Notifier