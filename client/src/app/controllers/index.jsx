import angular from 'angular';

import HomeController from './home';
import CollectionListController from './collection-list';
import CollectionController from './collection';
import ProductController from './product';
import ContactController from './contact';

export default angular
    .module('app.controllers', [])
    .controller('HomeController', HomeController)
    .controller('ProductController', ProductController)
    .controller('CollectionListController', CollectionListController)
    .controller('CollectionController', CollectionController)
    .controller('ContactController', ContactController)
    .name;