'use strict'

import angular from 'angular';
import ngRoute from 'angular-route';
import ngResource from 'angular-resource';
import Flow from 'ng-flow/dist/ng-flow-standalone';
import uiGrid from 'angular-ui-grid/ui-grid';
import uiBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import angularJwt from 'angular-jwt';
import ngCookies from 'angular-cookies';
import pascalprechtTranslate from 'angular-translate';
import 'angular-translate-storage-cookie';
import 'angular-translate-loader-static-files';

import config from './config';
import run from './run';

import controllers from './controllers';
import components from './components';
import directives from './directives';
import filters from './filters';
import services from './services';
import providers from './providers';
import constants from './constants';

window.Flow = Flow;

export default angular
    .module('admin', [
      ngRoute,
      ngResource,
      controllers,
      components,
      directives,
      filters,
      services,
      providers,
      constants,
      uiBootstrap,
      toastr,
      angularJwt,
      ngCookies,
      pascalprechtTranslate,
      'ui.grid', 
      'ui.grid.infiniteScroll', 
      'ui.grid.autoResize',
      'flow'
    ])
    .config(config)
    .run(run);
