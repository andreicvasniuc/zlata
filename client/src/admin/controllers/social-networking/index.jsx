class SocialNetworkingController {
  constructor($scope, $rootScope, socialNetworkingService, router, routeUrls, uiGridConstants) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.socialNetworkingService = socialNetworkingService;
    this.router = router;
    this.routeUrls = routeUrls;

    this.initialize();
    this.initializeSorting(uiGridConstants);
    this.loadSocialNetworkings();

    $scope.$on('reloadGrid', () => this.reloadGrid());
    $scope.$on('loadMoreData', () => this.loadMoreData());
    $scope.$on('executeSorting', (event, sortByOptions) => this.executeSearch(sortByOptions));
  }

  initialize() {
    this.start = 1;
    this.range = 10;
    this.offset = 0;
    this.socialNetworkings = [];
  }

  initializeSorting(uiGridConstants) {
    this.sortByEnum = { name: 'name', url: 'url', published: 'published', updated_at: 'updated_at' };
    this.router.initialize(this.sortByEnum, this.sortByEnum.updated_at, uiGridConstants.DESC);

    [this.sortBy, this.sortByDirection, this.searchText] = this.router.getSortAndSearch();
  }

  loadSocialNetworkings(successCallback) {
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

    this.socialNetworkingService.search(request,
      (response) => {
        this.socialNetworkings = this.socialNetworkings.concat(response.socialNetworkings);
        this.totalCount = response.totalCount;
        this.isLoadingSpinner = false;
        if(successCallback) successCallback();
      }, 
      () => { console.log('error'); });
  }

  reloadSocialNetworkings() {
    this.loadSocialNetworkings(() => this.$scope.$broadcast('moreDataLoaded'));
  }

  reloadGrid() {
    this.initialize();
    this.reloadSocialNetworkings();
  }

  loadMoreData() {
    this.start += 1;
    this.offset = (this.start - 1) * this.range;

    if (this.offset >= this.totalCount) return;

    this.reloadSocialNetworkings();
  }

  executeSearch(sortByOptions) {
    this.sortBy = sortByOptions.sortBy;
    this.sortByDirection = sortByOptions.sortByDirection;

    this.search();
  }

  addSocialNetworking() {
    this.$rootScope.$broadcast('openSocialNetworkingEditorPopup');
  }

  search() {
    this.router.goToSearchPage(this.routeUrls.social_networkings_search, this.sortBy, this.sortByDirection, this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.search();
  }
}

export default SocialNetworkingController