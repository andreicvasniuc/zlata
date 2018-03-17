import angular from 'angular';

import DashboardController from './dashboard';
import CollectionController from './collection';
import CollectionProductController from './collection-product';
import ProductController from './product';
import LoginController from './login';
import SocialNetworkingController from './social-networking';
import ContactGroupController from './contact-group';
import ContactGroupContactController from './contact-group-contact';
import ContactController from './contact';
import SliderController from './slider';
import SliderSlideController from './slider-slide';
import SlideController from './slide';

export default angular
    .module('admin.controllers', [])
    .controller('LoginController', LoginController)
    .controller('DashboardController', DashboardController)
    .controller('CollectionController', CollectionController)
    .controller('CollectionProductController', CollectionProductController)
    .controller('ProductController', ProductController)
    .controller('SocialNetworkingController', SocialNetworkingController)
    .controller('ContactGroupController', ContactGroupController)
    .controller('ContactGroupContactController', ContactGroupContactController)
    .controller('ContactController', ContactController)
    .controller('SliderController', SliderController)
    .controller('SliderSlideController', SliderSlideController)
    .controller('SlideController', SlideController)
    .name;