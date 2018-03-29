import angular from 'angular';

import resources from './resources';

import Router from './router';
import CollectionRouter from './collectionRouter';
import ProductRouter from './productRouter';
import Translator from './translator';
import Notifier from './notifier';
import RequestService from './requestService';
import ProductService from './productService';
import TreeProcessor from './treeProcessor';
import DeviceDetector from './deviceDetector';
import MenuService from './menuService';
import CollectionService from './collectionService';
import LocaleService from './localeService';
import SizeService from './sizeService';
import ColorService from './colorService';
import BreadcrumbService from './breadcrumbService';
import SocialNetworkingService from './socialNetworkingService';
import ContactGroupService from './contactGroupService';
import ContactService from './contactService';
import SliderService from './sliderService';

export default angular
    .module('app.services', [ resources ])
    .service('router', Router)
    .service('productRouter', ProductRouter)
    .service('collectionRouter', CollectionRouter)
    .service('translator', Translator)
    .service('notifier', Notifier)
    .service('requestService', RequestService)
    .service('productService', ProductService)
    .service('treeProcessor', TreeProcessor)
    .service('deviceDetector', DeviceDetector)
    .service('menuService', MenuService)
    .service('collectionService', CollectionService)
    .service('localeService', LocaleService)
    .service('sizeService', SizeService)
    .service('colorService', ColorService)
    .service('breadcrumbService', BreadcrumbService)
    .service('socialNetworkingService', SocialNetworkingService)
    .service('contactGroupService', ContactGroupService)
    .service('contactService', ContactService)
    .service('sliderService', SliderService)
    .name;