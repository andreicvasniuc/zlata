import angular from 'angular';

import mainLayout from './main-layout';
import mainHeader from './main-header';
import mainFooter from './main-footer';
import languageSelector from './language-selector';
import mainMenu from './main-menu';
import mobileMenu from './mobile-menu';
import slider from './slider';
import topProducts from './top-products';
import loadingIcon from './loading-icon';
import items from './items';
import itemDetails from './item-details';
import extraField from './extra-field';
import breadcrumb from './breadcrumb';
import socialNetworkings from './social-networkings';
import navigation from './navigation';
import contactForm from './contact-form';
import contactGroups from './contact-groups';

export default angular
    .module('app.components', [])
    .component('mainLayout', mainLayout)
    .component('mainHeader', mainHeader)
    .component('mainFooter', mainFooter)
    .component('languageSelector', languageSelector)
    .component('mainMenu', mainMenu)
    .component('mobileMenu', mobileMenu)
    .component('slider', slider)
    .component('topProducts', topProducts)
    .component('loadingIcon', loadingIcon)
    .component('items', items)
    .component('itemDetails', itemDetails)
    .component('extraField', extraField)
    .component('breadcrumb', breadcrumb)
    .component('socialNetworkings', socialNetworkings)
    .component('navigation', navigation)
    .component('contactForm', contactForm)
    .component('contactGroups', contactGroups)
    .name;