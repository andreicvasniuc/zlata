import angular from 'angular';

import CollectionResource from './collectionResource';
import ProductResource from './productResource';
import ImageResource from './imageResource';
import SizeResource from './sizeResource';
import ColorResource from './colorResource';
import SocialNetworkingResource from './socialNetworkingResource';
import ContactGroupResource from './contactGroupResource';
import ContactResource from './contactResource';
import SliderResource from './sliderResource';
import SlideResource from './slideResource';

export default angular
    .module('admin.services.resources', [])
    .service('collectionResource', CollectionResource)
    .service('productResource', ProductResource)
    .service('imageResource', ImageResource)
    .service('sizeResource', SizeResource)
    .service('colorResource', ColorResource)
    .service('socialNetworkingResource', SocialNetworkingResource)
    .service('contactGroupResource', ContactGroupResource)
    .service('contactResource', ContactResource)
    .service('sliderResource', SliderResource)
    .service('slideResource', SlideResource)
    .name;