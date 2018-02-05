import homeTemplate from './controllers/home/template.html';
import collectionListTemplate from './controllers/collection-list/template.html';
import collectionTemplate from './controllers/collection/template.html';
import productTemplate from './controllers/product/template.html';
import contactTemplate from './controllers/contact/template.html';

export default ($routeProvider, routeUrls, $translateProvider, languages, envProvider, $locationProvider) => {
  /* Routing */

  let routes = {
    home: {
      templateUrl: homeTemplate,
      controller: 'HomeController',
      controllerAs: '$ctrl'
    },
    collections: {
      templateUrl: collectionListTemplate,
      controller: 'CollectionListController',
      controllerAs: '$ctrl',
      resolve: {
          collectionResolver: (collectionService) => {
            return collectionService.dresses((response) => {
              return response.collections;
            });
          },
          titleTranslateId: () => 'ALL_COLLECTIONS'
      }
    },
    accessories: {
      templateUrl: collectionListTemplate,
      controller: 'CollectionListController',
      controllerAs: '$ctrl',
      resolve: {
          collectionResolver: (collectionService) => {
            return collectionService.accessories((response) => {
              return response.collections;
            });
          },
          titleTranslateId: () => 'ALL_ACCESSORIES'
      }
    },
    collection: {
      templateUrl: collectionTemplate,
      controller: 'CollectionController',
      controllerAs: '$ctrl'
    },
    product: {
      templateUrl: productTemplate,
      controller: 'ProductController',
      controllerAs: '$ctrl'
    },
    contacts: {
      templateUrl: contactTemplate,
      controller: 'ContactController',
      controllerAs: '$ctrl',
      resolve: {
          contactResolver: (contactService) => {
            return contactService.list((response) => {
              return response.contacts;
            });
          },
          titleTranslateId: () => 'CONTACTS'
      }
    }
  };

  $routeProvider
    .when(
        routeUrls.home,
        routes.home)
    .when(
        routeUrls.contacts,
        routes.contacts)
    .when(
        routeUrls.collections,
        routes.collections)
    .when(
        routeUrls.accessories,
        routes.accessories)
    .when(
        routeUrls.collection,
        routes.collection)
    .when(
        routeUrls.product,
        routes.product)
    .otherwise(
        { redirectTo: routeUrls.home });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    /* i18n and l10n */

    $translateProvider
      .useStaticFilesLoader({
        prefix: `${envProvider.getApiUrl()}/i18n/app/`,
        suffix: '.json'
      })
      //.determinePreferredLanguage();
      .useSanitizeValueStrategy('escape')
      .useCookieStorage()
      .fallbackLanguage(languages.en)
      .preferredLanguage(languages.ua);
}