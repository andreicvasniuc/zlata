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
          this.collection = collectionResponse.collection;
          this.getProduct(collectionResponse.collection);
          this.setColor(colorResponse.colors);
          this.setSize(sizeResponse.sizes);
          this.$timeout(() => this.isLoadingSpinner = false, 50);
        });
      });
    });
  }

  getProduct(collection) {
    this.product = collection.products.find((product) => this.findProduct(product));
    this.index = collection.products.findIndex((product) => this.findProduct(product));
    if(this.product) {
      this.createBreadcrumb(collection, this.product);
    } else {
      // go to 404
      console.log('go to 404');
    }
  }

  findProduct(product) {
    return product.slug == this.collectionRouter.getProductId();
  }

  createBreadcrumb(collection, product) {
    this.breadcrumbService.createBreadcrumbForProduct(collection, product, (breadcrumb) => {
      this.breadcrumb = breadcrumb;
    });
  }

  setColor(colors) {
    this.product.colors = this.getItems(colors, this.product.color_ids);
  }

  setSize(sizes) {
    this.product.sizes = this.getItems(sizes, this.product.size_ids);
  }

  getItems(items, itemIds) {
    return items.filter((item) => itemIds.includes(item._id.$oid));
  }
}

export default ProductController