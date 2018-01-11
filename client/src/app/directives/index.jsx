import angular from 'angular';

import outsideClick from './outside-click';
import lightGallery from './light-gallery';

export default angular
    .module('app.directives', [])
    .directive('outsideClick', outsideClick)
    .directive('lightGallery', lightGallery)
    .name;