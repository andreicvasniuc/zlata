class CollectionController {
  constructor($timeout, collectionService, collectionRouter, breadcrumbService) {
    this.$timeout = $timeout;
    this.collectionService = collectionService;
    this.collectionRouter = collectionRouter;
    this.breadcrumbService = breadcrumbService;

    this.loadCollection();
  }

  loadCollection() {
    this.isLoadingSpinner = true;

    this.collectionService.get(this.collectionRouter.getId(), (response) => {
      this.collection = response.collection;
      this.products = response.collection.products.filter((product) => product.published);
      this.createBreadcrumb(this.collection);
      this.$timeout(() => this.isLoadingSpinner = false, 50);
    });
  }

  createBreadcrumb(collection) {
    this.breadcrumbService.createBreadcrumbForCollection(collection, (breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
  }

  getProductUrl(product) {
    return this.collectionRouter.getProductUrl(this.collection.slug, product.slug);
  }

  getCoverProductImageSource(product) {
    return product.cover_image && product.cover_image.url;
  }
}

export default CollectionController