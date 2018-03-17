class SliderSlideController {
  constructor($scope, $rootScope, sliderService, slideService, slideRouter, routeUrls, uiGridConstants) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.sliderService = sliderService;
    this.slideService = slideService;
    this.slideRouter = slideRouter;
    this.routeUrls = routeUrls;
    this.uiGridConstants = uiGridConstants;

    this.initialize();
    this.initializeSorting();
    this.loadSlider();

    $scope.$on('reloadGrid', () => this.reloadGrid());
    $scope.$on('loadMoreData', () => this.loadMoreData());
    $scope.$on('executeSorting', (event, sortByOptions) => this.executeSearch(sortByOptions));
  }

  initialize() {
    this.slides = [];
  }

  initializeSorting() {
    this.sortByEnum = { title: 'title', link_text: 'link_text', link_url: 'link_url', published: 'published', updated_at: 'updated_at' };
    this.slideRouter.initialize(this.sortByEnum, this.sortByEnum.updated_at, this.uiGridConstants.DESC);

    [this.sortBy, this.sortByDirection, this.searchText] = this.slideRouter.getSortAndSearch();
  }

  loadSlider() {
    this.isLoadingSpinner = true;

    this.sliderService.get(this.slideRouter.getSliderId(), (slider) => {
      this.slider = slider;
      this.slides = this.searchSlides(slider.slides);
      this.totalCount = this.slides.length;
      this.isLoadingSpinner = false;
    });
  }

  searchSlides(slides) {
    if(!slides) return [];

    if(this.searchText) {
      slides = _.filter(slides, (slide) => slide.title && slide.title.indexOf(this.searchText) != -1);
    }

    slides = _.sortBy(slides, (slide) => slide[this.sortBy] && slide[this.sortBy].toLowerCase && slide[this.sortBy].toLowerCase());

    if (this.sortByDirection == this.uiGridConstants.DESC) {
        slides = slides.reverse();
    }

    return slides;
  }

  reloadGrid() {
    this.loadSlider();
  }

  loadMoreData() {
  }

  executeSearch(sortByOptions) {
    this.sortBy = sortByOptions.sortBy;
    this.sortByDirection = sortByOptions.sortByDirection;

    this.search();
  }

  addSlide() {
    this.$rootScope.$broadcast('openSlideEditorPopup');
  }

  search() {
    this.slideRouter.goToSearchPage(this.routeUrls.slider_slides_search, this.sortBy, this.sortByDirection, this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.search();
  }
}

export default SliderSlideController