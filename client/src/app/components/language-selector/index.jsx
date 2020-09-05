import './style.styl';

import template from './template.html';

import enIcon from 'images/flags/en.png';
import ruIcon from 'images/flags/ru.png';
import uaIcon from 'images/flags/ua.png';
import roIcon from 'images/flags/ro.png';

class LanguageSelectorController {
  constructor($route, $timeout, $window, $rootScope, localeService, languages, defaultLanguage) {
    this.$route = $route;
    this.$timeout = $timeout;
    this.$window = $window;
    this.$rootScope = $rootScope;
    this.localeService = localeService;
    this.languages = languages;
    this.defaultLanguage = defaultLanguage;
  }

  $onInit() {
    this.createLanguageList();
    this.getLanguageFromCookies();
  }

  createLanguageList() {
    this.languageList = [
      { key: this.languages.ua, icon: uaIcon, title: 'Українська' },
      { key: this.languages.ru, icon: ruIcon, title: 'Русский' },
      { key: this.languages.ro, icon: roIcon, title: 'Română' },
      { key: this.languages.en, icon: enIcon, title: 'English' }
    ];
  }

  getLanguageFromCookies() {
    let languageKey = this.localeService.get();
    if(languageKey) {
      this.selectedLanguage = this.getLanguageByKey(languageKey);
    } else {
      languageKey = navigator.language.split('-')[0].toLowerCase();
      this.selectedLanguage = this.getLanguageByKey(languageKey) || this.getLanguageByKey(this.defaultLanguage);
      this.selectLanguage(this.selectedLanguage);
    }
  }

  getLanguageByKey(languageKey) {
    return _.find(this.languageList, { key: languageKey });
  }

  selectLanguage(language) {
    this.selectedLanguage = language;
    this.localeService.set(this.selectedLanguage.key);

    this.$timeout(() => {
      this.$route.reload();

      if(this.$rootScope.isMobileMenuVisible) {
        this.$timeout(() => this.$rootScope.isMobileMenuVisible = true, 50); // to display mobile menu
      } else {
        $(this.$window).scrollTop($(this.$window).scrollTop() + 1); // to display sticky menu
      }
    }, 1000);
  }
}

let languageSelector = {
  bindings: {
  },
  controller: LanguageSelectorController,
  templateUrl: template
};

export default languageSelector
