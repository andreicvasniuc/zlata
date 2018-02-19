import angular from 'angular';

import CollectionResource from './collectionResource';
import ProductResource from './productResource';
import SizeResource from './sizeResource';
import ColorResource from './colorResource';
import SocialNetworkingResource from './socialNetworkingResource';
import ContactGroupResource from './contactGroupResource';

export default angular
    .module('app.services.resources', [])
    .service('collectionResource', CollectionResource)
    .service('productResource', ProductResource)
    .service('sizeResource', SizeResource)
    .service('colorResource', ColorResource)
    .service('socialNetworkingResource', SocialNetworkingResource)
    .service('contactGroupResource', ContactGroupResource)
    .name;