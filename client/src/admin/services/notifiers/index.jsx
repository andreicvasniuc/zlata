import angular from 'angular';

import CollectionNotifier from './collectionNotifier';
import ProductNotifier from './productNotifier';
import ImageNotifier from './imageNotifier';
import LoginNotifier from './loginNotifier';
import SocialNetworkingNotifier from './socialNetworkingNotifier';
import ContactGroupNotifier from './contactGroupNotifier';
import ContactNotifier from './contactNotifier';
import SliderNotifier from './sliderNotifier';
import SlideNotifier from './slideNotifier';

export default angular
    .module('admin.services.notifiers', [])
    .service('collectionNotifier', CollectionNotifier)
    .service('productNotifier', ProductNotifier)
    .service('imageNotifier', ImageNotifier)
    .service('loginNotifier', LoginNotifier)
    .service('socialNetworkingNotifier', SocialNetworkingNotifier)
    .service('contactGroupNotifier', ContactGroupNotifier)
    .service('contactNotifier', ContactNotifier)
    .service('sliderNotifier', SliderNotifier)
    .service('slideNotifier', SlideNotifier)
    .name;