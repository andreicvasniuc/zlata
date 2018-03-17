class Navigator {
  constructor(router, routeUrls) {
    this.router = router;
    this.routeUrls = routeUrls;
    this.navigationItems = this.getNavigationItems();
  }

  getNavigationItems() {
    return [
      { title: 'DASHBOARD', url: this.routeUrls.dashboard, cssClass: 'dashboard' },
      { title: 'COLLECTIONS', url: this.routeUrls.collections, cssClass: 'table' },
      { title: 'PRODUCTS', url: this.routeUrls.products, cssClass: 'table' },
      { title: 'SOCIAL_NETWORKINGS', url: this.routeUrls.social_networkings, cssClass: 'table' },
      { title: 'CONTACT_GROUPS', url: this.routeUrls.contact_groups, cssClass: 'table' },
      { title: 'CONTACTS', url: this.routeUrls.contacts, cssClass: 'table' },
      { title: 'SLIDERS', url: this.routeUrls.sliders, cssClass: 'table' },
      { title: 'SLIDES', url: this.routeUrls.slides, cssClass: 'table' }
    ];
  }

  getCurrentNavigationItem() {
    return _.find(this.navigationItems, (item) => this.router.doesUrlContain(item.url));
  }
}

export default Navigator