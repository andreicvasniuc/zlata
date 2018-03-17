class SlideController {
  constructor($rootScope, $timeout) {
    $timeout(() => $rootScope.$broadcast('openSliderSelector'));
  }
}

export default SlideController