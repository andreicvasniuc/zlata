class ContactGroupController {
  constructor($scope, $rootScope, contactGroupService, router, routeUrls, uiGridConstants) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.contactGroupService = contactGroupService;
    this.router = router;
    this.routeUrls = routeUrls;

    this.initialize();
    this.initializeSorting(uiGridConstants);
    this.loadContactGroups();

    $scope.$on('reloadGrid', () => this.reloadGrid());
    $scope.$on('loadMoreData', () => this.loadMoreData());
    $scope.$on('executeSorting', (event, sortByOptions) => this.executeSearch(sortByOptions));
  }

  initialize() {
    this.start = 1;
    this.range = 10;
    this.offset = 0;
    this.contactGroups = [];
  }

  initializeSorting(uiGridConstants) {
    this.sortByEnum = { name: 'name', published: 'published', updated_at: 'updated_at' };
    this.router.initialize(this.sortByEnum, this.sortByEnum.updated_at, uiGridConstants.DESC);

    [this.sortBy, this.sortByDirection, this.searchText] = this.router.getSortAndSearch();
  }

  loadContactGroups(successCallback) {
    this.isLoadingSpinner = true;

    let request = {
      pagination: {
        skip: this.offset,
        take: this.range
      },
      sorting: {
        field: this.sortBy,
        direction: this.sortByDirection
      },
      search: this.searchText
    };

    this.contactGroupService.search(request,
      (response) => {
        this.contactGroups = this.contactGroups.concat(response.contactGroups);
        this.totalCount = response.totalCount;
        this.isLoadingSpinner = false;
        if(successCallback) successCallback();
      }, 
      () => { console.log('error'); });
  }

  reloadContactGroups() {
    this.loadContactGroups(() => this.$scope.$broadcast('moreDataLoaded'));
  }

  reloadGrid() {
    this.initialize();
    this.reloadContactGroups();
  }

  loadMoreData() {
    this.start += 1;
    this.offset = (this.start - 1) * this.range;

    if (this.offset >= this.totalCount) return;

    this.reloadContactGroups();
  }

  executeSearch(sortByOptions) {
    this.sortBy = sortByOptions.sortBy;
    this.sortByDirection = sortByOptions.sortByDirection;

    this.search();
  }

  addContactGroup() {
    this.$rootScope.$broadcast('openContactGroupEditorPopup');
  }

  search() {
    this.router.goToSearchPage(this.routeUrls.contact_groups_search, this.sortBy, this.sortByDirection, this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.search();
  }
}

export default ContactGroupController