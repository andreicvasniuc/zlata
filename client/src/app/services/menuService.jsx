class MenuService {
  constructor(routeUrls, translator) {
    this.routeUrls = routeUrls;
    this.translator = translator;
  }

  getMenu() {
    this.menu = this.createMenu();
    this.translator.translateDeep(this.menu, 'list', 'name');

    return this.menu;
  }

  createMenu() {
    return {
      list: [
          { name: 'HOME', url: this.routeUrls.home },
          { name: 'CATALOG', url: this.routeUrls.collections, list: 
            [
              { name: 'COLLECTIONS', url: this.routeUrls.collections },
              { name: 'ACCESSORIES', url: this.routeUrls.accessories }
            ]
          },
          { name: 'CONTACTS', url: this.routeUrls.contacts }
      ]
    };
  }
}

export default MenuService