import angular from 'angular';

import resources from './resources';
import notifiers from './notifiers';

import RouterService from './router';
import ProductRouterService from './productRouter';
import NavigatorService from './navigator';
import NotifierService from './notifier';
import ModalAlert from './modalAlert';
import RequestService from './requestService';
import CollectionService from './collectionService';
import ProductService from './productService';
import ImageService from './imageService';
import LoginService from './loginService';
import LocaleService from './localeService';
import SizeService from './sizeService';
import ColorService from './colorService';
import SocialNetworkingService from './socialNetworkingService';
import ContactGroupService from './contactGroupService';
import ContactRouterService from './contactRouter';
import ContactService from './contactService';
import SliderService from './sliderService';
import SlideRouterService from './slideRouter';
import SlideService from './slideService';
import DataService from './dataService';

export default angular
    .module('admin.services', [ resources, notifiers ])
    .service('router', RouterService)
    .service('productRouter', ProductRouterService)
    .service('navigator', NavigatorService)
    .service('notifier', NotifierService)
    .service('modalAlert', ModalAlert)
    .service('requestService', RequestService)
    .service('collectionService', CollectionService)
    .service('productService', ProductService)
    .service('imageService', ImageService)
    .service('loginService', LoginService)
    .service('localeService', LocaleService)
    .service('sizeService', SizeService)
    .service('colorService', ColorService)
    .service('socialNetworkingService', SocialNetworkingService)
    .service('contactGroupService', ContactGroupService)
    .service('contactRouter', ContactRouterService)
    .service('contactService', ContactService)
    .service('sliderService', SliderService)
    .service('slideRouter', SlideRouterService)
    .service('slideService', SlideService)
    .service('dataService', DataService)
    .name;