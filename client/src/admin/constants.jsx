import angular from 'angular';

export default angular
    .module('admin.constants', [])
    .constant('routeUrls', { 
        index: '/', 
        login: '/login', 
        dashboard: '/dashboard', 
        collections: '/collections', 
        collection_products: '/collection/:collectionId/products', 
        products: '/products',
        social_networkings: '/social-networkings'
      })
    .constant('languages', { en: 'en', ru: 'ru', ua: 'ua', ro: 'ro' })
    .name;