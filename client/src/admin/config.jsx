import loginTemplate from './controllers/login/template.html';
import dashboardTemplate from './controllers/dashboard/template.html';
import collectionTemplate from './controllers/collection/template.html';
import collectionProductTemplate from './controllers/collection-product/template.html';
import productTemplate from './controllers/product/template.html';
import socialNetworkingTemplate from './controllers/social-networking/template.html';

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
    }
  };

  let searchPath = '/sort/:sortBy/:sortByDirection/search/:searchText?';
  routeUrls.collections_search = routeUrls.collections + searchPath;
  routeUrls.collection_products_search = routeUrls.collection_products + searchPath;
  routeUrls.social_networkings_search = routeUrls.social_networkings + searchPath;

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