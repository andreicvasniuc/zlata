class ContactRouter {
  constructor($routeParams, router) {
    this.$routeParams = $routeParams;
    this.router = router;

    this.paramMasks = {
      contactGroupId: ':contactGroupId'
    };
  }

  initialize(sortByEnum, defaultSortByEnumItem, defaultSortByDirectionEnumItem) {
    this.router.initialize(sortByEnum, defaultSortByEnumItem, defaultSortByDirectionEnumItem);
  }

  getContactGroupId() {
    return this.$routeParams.contactGroupId;
  }

  getSortAndSearch() {
    return this.router.getSortAndSearch();
  }

  goTo(url, contactGroupId) {
    url = url.replace(this.paramMasks.contactGroupId, contactGroupId);
    this.router.goTo(url);
  }

  goToSearchPage(url, sortBy, sortByDirection, searchText) {
    url = url.replace(this.paramMasks.contactGroupId, this.getContactGroupId());
    this.router.goToSearchPage(url, sortBy, sortByDirection, searchText);
  }
}

export default ContactRouter