import angular from 'angular';

import DashboardController from './dashboard';
import CollectionController from './collection';
import CollectionProductController from './collection-product';
import ProductController from './product';
import LoginController from './login';
import SocialNetworkingController from './social-networking';
import ContactGroupController from './contact-group';
import ContactGroupContactController from './contact-group-contact';

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
    .name;