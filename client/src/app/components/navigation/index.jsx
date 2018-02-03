import './style.styl';

import template from './template.html';

class NavigationController {
  constructor(collectionRouter) {
    this.collectionRouter = collectionRouter;
  }

  getPrevLinkUrl() {
    return this.isPrevLinkVisible() ? this.getProductUrl(this.index - 1) : '';
  }

  getNextLinkUrl() {
    return this.isNextLinkVisible() ? this.getProductUrl(this.index + 1) : '';
  }

  getProductUrl(productIndex) {
    return this.collectionRouter.getProductUrl(this.collection.slug, this.collection.products[productIndex].slug);
  }

  isPrevLinkVisible() {
    return this.index != 0;
  }

  isNextLinkVisible() {
    return this.index != this.collection.products.length - 1;
  }
}

let navigation = {
  bindings: {
    collection: '<',
    index: '<'
  },
  controller: NavigationController,
  templateUrl: template
};

export default navigation