import loginTemplate from './controllers/login/template.html';
import dashboardTemplate from './controllers/dashboard/template.html';
import collectionTemplate from './controllers/collection/template.html';
import collectionProductTemplate from './controllers/collection-product/template.html';
import productTemplate from './controllers/product/template.html';
import socialNetworkingTemplate from './controllers/social-networking/template.html';
import contactGroupTemplate from './controllers/contact-group/template.html';
import contactGroupContactTemplate from './controllers/contact-group-contact/template.html';
import contactTemplate from './controllers/contact/template.html';
import sliderTemplate from './controllers/slider/template.html';
import sliderSlideTemplate from './controllers/slider-slide/template.html';
import slideTemplate from './controllers/slide/template.html';

export default ($routeProvider, routeUrls, $httpProvider, jwtOptionsProvider, $translateProvider, languages, envProvider, $locationProvider) => {
  /* Routing */

  let routes = {
    login: {
      templateUrl: loginTemplate,
      controller: 'LoginController',
      controllerAs: '$ctrl'
    },
    dashboard: {
      templateUrl: dashboardTemplate,
      controller: 'DashboardController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    collections: {
      templateUrl: collectionTemplate,
      controller: 'CollectionController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    collection_products: {
      templateUrl: collectionProductTemplate,
      controller: 'CollectionProductController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    products: {
      templateUrl: productTemplate,
      controller: 'ProductController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    social_networkings: {
      templateUrl: socialNetworkingTemplate,
      controller: 'SocialNetworkingController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    contact_groups: {
      templateUrl: contactGroupTemplate,
      controller: 'ContactGroupController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    contact_group_contacts: {
      templateUrl: contactGroupContactTemplate,
      controller: 'ContactGroupContactController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    contacts: {
      templateUrl: contactTemplate,
      controller: 'ContactController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    sliders: {
      templateUrl: sliderTemplate,
      controller: 'SliderController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    slider_slides: {
      templateUrl: sliderSlideTemplate,
      controller: 'SliderSlideController',
      controllerAs: '$ctrl',
      requiresLogin: true
    },
    slides: {
      templateUrl: slideTemplate,
      controller: 'SlideController',
      controllerAs: '$ctrl',
      requiresLogin: true
    }
  };

  let searchPath = '/sort/:sortBy/:sortByDirection/search/:searchText?';
  routeUrls.collections_search = routeUrls.collections + searchPath;
  routeUrls.collection_products_search = routeUrls.collection_products + searchPath;
  routeUrls.social_networkings_search = routeUrls.social_networkings + searchPath;
  routeUrls.contact_groups_search = routeUrls.contact_groups + searchPath;
  routeUrls.contact_group_contacts_search = routeUrls.contact_group_contacts + searchPath;
  routeUrls.sliders_search = routeUrls.sliders + searchPath;
  routeUrls.slider_slides_search = routeUrls.slider_slides + searchPath;

  $routeProvider
    .when(
        routeUrls.login,
        routes.login)
    .when(
        routeUrls.index,
        routes.dashboard)
    .when(
        routeUrls.dashboard,
        routes.dashboard)
    .when(
        routeUrls.collections,
        routes.collections)
    .when(
        routeUrls.collections_search,
        routes.collections)
    .when(
        routeUrls.products,
        routes.products)
    .when(
        routeUrls.collection_products,
        routes.collection_products)
    .when(
        routeUrls.collection_products_search,
        routes.collection_products)
    .when(
        routeUrls.social_networkings,
        routes.social_networkings)
    .when(
        routeUrls.social_networkings_search,
        routes.social_networkings)
    .when(
        routeUrls.contact_groups,
        routes.contact_groups)
    .when(
        routeUrls.contact_groups_search,
        routes.contact_groups)
    .when(
        routeUrls.contacts,
        routes.contacts)
    .when(
        routeUrls.contact_group_contacts,
        routes.contact_group_contacts)
    .when(
        routeUrls.contact_group_contacts_search,
        routes.contact_group_contacts)
    .when(
        routeUrls.sliders,
        routes.sliders)
    .when(
        routeUrls.sliders_search,
        routes.sliders)
    .when(
        routeUrls.slides,
        routes.slides)
    .when(
        routeUrls.slider_slides,
        routes.slider_slides)
    .when(
        routeUrls.slider_slides_search,
        routes.slider_slides)
    .otherwise(
        { redirectTo: routeUrls.collections });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    /* JWT configuration */

    jwtOptionsProvider.config({
      tokenGetter: () => { return sessionStorage.getItem('auth_token'); },
      whiteListedDomains: ['localhost'],
      //unauthenticatedRedirectPath: routeUrls.login
      unauthenticatedRedirector: (router, loginService) => { 
        console.log('unauthenticatedRedirector');
        loginService.redirectToUrl = router.getCurrentUrl();
        router.goTo(routeUrls.login);
      }
    });
    $httpProvider.interceptors.push('jwtInterceptor');

    /* i18n and l10n */

    $translateProvider
      .useStaticFilesLoader({
        prefix: `${envProvider.getApiUrl()}/i18n/admin/`,
        suffix: '.json'
      })
      //.determinePreferredLanguage();
      .useSanitizeValueStrategy('escape')
      .useCookieStorage()
      .fallbackLanguage(languages.en)
      .preferredLanguage(languages.ua);
}