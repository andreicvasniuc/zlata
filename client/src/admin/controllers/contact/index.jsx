class ContactController {
  constructor($rootScope, $timeout) {
    $timeout(() => $rootScope.$broadcast('openContactGroupSelector'));
  }
}

export default ContactController