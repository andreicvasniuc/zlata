class BreadcrumbService {
  constructor($translate, routeUrls, collectionRouter) {
    this.$translate = $translate;
    this.routeUrls = routeUrls;
    this.collectionRouter = collectionRouter;
  }

  createBreadcrumb(name, url) {
    return [this.createItem(name, url)];
  }

  createBreadcrumbForCollection(collection, callback) {
    let translateId = this.getTranslateId(collection);
    let url = this.getUrl(collection);

    this.$translate(translateId).then((translation) => {
      let breadcrumb = [this.createItem(translation, url), this.createItem(collection.name)];
      if (callback) callback(breadcrumb);
    });
  }

  createBreadcrumbForProduct(collection, product, callback) {
    let translateId = this.getTranslateId(collection);
    let url = this.getUrl(collection);

    this.$translate(translateId).then((translation) => {
      let breadcrumb = [
        this.createItem(translation, url), 
        this.createItem(collection.name, this.getCollectionUrl(collection)),
        this.createItem(product.name)
      ];
      if (callback) callback(breadcrumb);
    });
  }

  getCollectionUrl(collection) {
    return this.collectionRouter.getUrl(collection.slug);
  }

  createItem(name, url) {
    return { name: name, url: url };
  }

  getTranslateId(collection) {
    return collection.has_accessories ? 'ALL_ACCESSORIES' : 'ALL_COLLECTIONS';
  }

  getUrl(collection) {
    return collection.has_accessories ? this.routeUrls.accessories : this.routeUrls.collections;
  }
}

export default BreadcrumbService