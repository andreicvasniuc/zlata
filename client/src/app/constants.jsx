import angular from 'angular';

export default angular
    .module('app.constants', [])
    .constant('routeUrls', { 
        home: '/', 
        collections: '/collections', 
        collection: '/:collection', 
        product: '/:collection/:product', 
        accessories: '/accessories', 
        contacts: '/contacts'
      })
    .constant('languages', { en: 'en', ru: 'ru', ua: 'ua', ro: 'ro' })
    .name;