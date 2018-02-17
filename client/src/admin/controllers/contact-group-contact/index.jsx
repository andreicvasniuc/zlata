class ContactGroupContactController {
  constructor($scope, $rootScope, contactGroupService, contactService, contactRouter, routeUrls, uiGridConstants) {
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.contactGroupService = contactGroupService;
    this.contactService = contactService;
    this.contactRouter = contactRouter;
    this.routeUrls = routeUrls;
    this.uiGridConstants = uiGridConstants;

    this.initialize();
    this.initializeSorting();
    this.loadContactGroup();

    $scope.$on('reloadGrid', () => this.reloadGrid());
    $scope.$on('loadMoreData', () => this.loadMoreData());
    $scope.$on('executeSorting', (event, sortByOptions) => this.executeSearch(sortByOptions));
  }

  initialize() {
    this.contacts = [];
  }

  initializeSorting() {
    this.sortByEnum = { name: 'name', description: 'description', published: 'published', updated_at: 'updated_at' };
    this.contactRouter.initialize(this.sortByEnum, this.sortByEnum.updated_at, this.uiGridConstants.DESC);

    [this.sortBy, this.sortByDirection, this.searchText] = this.contactRouter.getSortAndSearch();
  }

  loadContactGroup() {
    this.isLoadingSpinner = true;

    this.contactGroupService.get(this.contactRouter.getContactGroupId(), (contactGroup) => {
      this.contactGroup = contactGroup;
      this.contacts = this.searchContacts(contactGroup.contacts);
      this.totalCount = this.contacts.length;
      this.isLoadingSpinner = false;
    });
  }

  searchContacts(contacts) {
    if(!contacts) return [];

    if(this.searchText) {
      contacts = _.filter(contacts, (contact) => contact.name && contact.name.indexOf(this.searchText) != -1);
    }

    contacts = _.sortBy(contacts, (contact) => contact[this.sortBy] && contact[this.sortBy].toLowerCase && contact[this.sortBy].toLowerCase());

    if (this.sortByDirection == this.uiGridConstants.DESC) {
        contacts = contacts.reverse();
    }

    return contacts;
  }

  reloadGrid() {
    this.loadContactGroup();
  }

  loadMoreData() {
  }

  executeSearch(sortByOptions) {
    this.sortBy = sortByOptions.sortBy;
    this.sortByDirection = sortByOptions.sortByDirection;

    this.search();
  }

  addContact() {
    this.$rootScope.$broadcast('openContactEditorPopup');
  }

  search() {
    this.contactRouter.goToSearchPage(this.routeUrls.contact_group_contacts_search, this.sortBy, this.sortByDirection, this.searchText);
  }

  clearSearch() {
    this.searchText = '';
    this.search();
  }
}

export default ContactGroupContactController