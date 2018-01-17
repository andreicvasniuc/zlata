class ProductController {
  constructor($timeout, colorService, sizeService, collectionService, collectionRouter, breadcrumbService) {
    this.$timeout = $timeout;
    this.colorService = colorService;
    this.sizeService = sizeService;
    this.collectionService = collectionService;
    this.collectionRouter = collectionRouter;
    this.breadcrumbService = breadcrumbService;

    this.loadData();
  }

  loadData() {
    this.isLoadingSpinner = true;

    this.collectionService.get(this.collectionRouter.getId(), (collectionResponse) => {
      this.colorService.list((colorResponse) => {
        this.sizeService.list((sizeResponse) => {
          this.getProduct(collectionResponse.collection);
          this.setColor(colorResponse.colors);
          this.setSize(sizeResponse.sizes);
          this.$timeout(() => this.isLoadingSpinner = false, 50);
        });
      });
    });
  }

  getProduct(collection) {
    this.product = collection.products.find((product) => product.slug == this.collectionRouter.getProductId());
    if(this.product) {
      this.createBreadcrumb(collection, this.product);
    } else {
      // go to 404
      console.log('go to 404');
    }
  }

  createBreadcrumb(collection, product) {
    this.breadcrumbService.createBreadcrumbForProduct(collection, product, (breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
  }

  setColor(colors) {
    this.product.color = this.getItem(colors, this.product.color_id);
  }

  setSize(sizes) {
    this.product.size = this.getItem(sizes, this.product.size_id);
  }

  getItem(items, itemId) {
    return items.find((item) => item._id.$oid == itemId);
  }
}

export default ProductController