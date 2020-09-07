import template from './template.html';

import logoBlackIcon from 'images/logo-black-text.png';

class MobileMenuController {
  constructor($rootScope, menuService) {
    this.$rootScope = $rootScope;
    this.logoBlackIcon = logoBlackIcon;
    this.menu = menuService.getMenu();
  }

  toggleMobileMenu() {
    this.$rootScope.isMobileMenuVisible = !this.$rootScope.isMobileMenuVisible;
  }

  hideMobileMenu() {
    this.$rootScope.isMobileMenuVisible = false;
  }

  toggleSubMenu(event, hasSubMenu) {
    if(!hasSubMenu) return;

    event.preventDefault();

    let menuItem = $(event.target);
    let menuItemCssClass = 'fh5co-sub-ddown';

    if(!menuItem.hasClass(menuItemCssClass)) {
      menuItem = menuItem.find(`.${menuItemCssClass}`).length == 0 ? menuItem : menuItem.find(`.${menuItemCssClass}`);
      if(!menuItem.hasClass(menuItemCssClass)) {
        menuItem = menuItem.parents(`.${menuItemCssClass}`);
      }
    }

    menuItem.find('~ .fh5co-sub-menu').slideToggle(200);
  }
}

let mobileMenu = {
  bindings: {},
  controller: MobileMenuController,
  templateUrl: template
};

export default mobileMenu