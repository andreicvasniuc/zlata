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
        sliders: '/sliders', 
        slider_slides: '/slider/:sliderId/slides', 
        slides: '/slides'
      })
    .constant('languages', { en: 'en', ru: 'ru', ua: 'ua', ro: 'ro' })
    .constant('defaultLanguage', 'en')
    .name;