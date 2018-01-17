class CollectionListController {
  constructor($timeout, $translate, collectionResolver, collectionRouter, titleTranslateId, breadcrumbService) {
    this.$timeout = $timeout;
    this.collectionResolver = collectionResolver;
    this.collectionRouter = collectionRouter;
    this.breadcrumbService = breadcrumbService;

    this.getTranslation($translate, titleTranslateId);
    this.loadCollections();
  }

  loadCollections() {
    this.isLoadingSpinner = true;

    this.collectionResolver.$promise.then((response) => {
      this.collections = response.collections || [];
      if(this.collections.length == 1) this.goToCollection(this.collections[0]);
      this.$timeout(() => this.isLoadingSpinner = false, 50);
    });
  }

  getTranslation($translate, titleTranslateId) {
    $translate(titleTranslateId).then((translation) => {
      this.title = translation;
      this.breadcrumb = this.breadcrumbService.createBreadcrumb(this.title);
    });
  }

  goToCollection(collection) {
    this.collectionRouter.goTo(collection.slug);
  }

  getCollectionUrl(collection) {
    return this.collectionRouter.getUrl(collection.slug);
  }

  getImageSource(collection) {
    return collection.image && collection.image.url;
  }
}

export default CollectionListController