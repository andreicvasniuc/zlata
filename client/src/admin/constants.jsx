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
        social_networkings: '/social-networkings',
        contact_groups: '/contact-groups', 
        contact_group_contacts: '/contact-group/:contactGroupId/contacts', 
        contacts: '/contacts',
      })
    .constant('languages', { en: 'en', ru: 'ru', ua: 'ua', ro: 'ro' })
    .name;