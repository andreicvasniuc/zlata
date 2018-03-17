class SlideRouter {
  constructor($routeParams, router) {
    this.$routeParams = $routeParams;
    this.router = router;

    this.paramMasks = {
      sliderId: ':sliderId'
    };
  }

  initialize(sortByEnum, defaultSortByEnumItem, defaultSortByDirectionEnumItem) {
    this.router.initialize(sortByEnum, defaultSortByEnumItem, defaultSortByDirectionEnumItem);
  }

  getSliderId() {
    return this.$routeParams.sliderId;
  }

  getSortAndSearch() {
    return this.router.getSortAndSearch();
  }

  goTo(url, sliderId) {
    url = url.replace(this.paramMasks.sliderId, sliderId);
    this.router.goTo(url);
  }

  goToSearchPage(url, sortBy, sortByDirection, searchText) {
    url = url.replace(this.paramMasks.sliderId, this.getSliderId());
    this.router.goToSearchPage(url, sortBy, sortByDirection, searchText);
  }
}

export default SlideRouter