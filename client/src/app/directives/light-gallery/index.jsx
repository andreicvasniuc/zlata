export default () => {
  return (scope, element, attrs) => {
    if (scope.$last) {
        // ng-repeat is completed
        window.lightGallery(element.parent()[0]);
    }
  }; 
};
