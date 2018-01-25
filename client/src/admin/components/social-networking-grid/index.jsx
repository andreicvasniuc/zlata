import './style.styl';

import template from './template.html';
import gridActionCell from './grid-action-cell.html';
import gridPublishedCell from './grid-published-cell.html';
import gridImageCell from './grid-image-cell.html';

class SocialNetworkingGridController {
  constructor($scope, $rootScope, $timeout, $translate, socialNetworkingService, socialNetworkingNotifier, modalAlert, productRouter, routeUrls) {
    self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.socialNetworkingService = socialNetworkingService;
    this.socialNetworkingNotifier = socialNetworkingNotifier;
    this.modalAlert = modalAlert;
    this.productRouter = productRouter;
    this.routeUrls = routeUrls;

    this.createColumnDefinitions();
    this.createCallbacks();
    this.setGridHeight();
  }

  createColumnDefinitions() {
    this.columnDefinitions = [
      {
          field: 'icon',
          displayName: "ICON",
          headerCellFilter: "translate",
          cellTemplate: gridImageCell,
          clickable: false,
          width: 120
      },
      {
          field: 'name',
          displayName: 'NAME',
          headerCellFilter: "translate",
          sortable: true
      },
      {
          field: 'updated_at',
          displayName: 'EDIT_DATE',
          headerCellFilter: "translate",
          cellFilter: 'date:"dd/MM/yyyy"',
          sortable: true,
          width: 200
      },
      {
          field: 'published',
          displayName: '',
          cellTemplate: gridPublishedCell,
          clickable: false,
          sortable: true,
          width: 35
      },
      {
          field: 'action',
          displayName: '',
          cellTemplate: gridActionCell,
          clickable: false,
          width: 85
      }
    ];
  }

  createCallbacks() {
    this.callbacks = {
      edit: this.edit,
      upload: this.upload,
      delete: this.delete,
      clickOnRow: this.clickOnRow,
      publish: this.publish
    };
  }

  editSocialNetworking(entity, openImageUploadingTab) {
    self.socialNetworkingService.get(entity.slug, (response) => {
      self.$rootScope.$broadcast('openSocialNetworkingEditorPopup', response, openImageUploadingTab);
    });
  }

  edit(entity, event) {
    self.editSocialNetworking(entity, false);
  }

  upload(entity, event) {
    self.editSocialNetworking(entity, true);
  }

  deleteSocialNetworking(socialNetworking) {
    this.socialNetworkingService.delete(socialNetworking, (response) => {
      this.$scope.$emit('reloadGrid');
      this.socialNetworkingNotifier.showSuccessDeleteMessage();
    });
  }

  delete(entity, event) {
    self.$translate('DELETE_SOCIAL_NETWORKING_MESSAGE').then((message) => {
      self.$translate('NO').then((no) => {
        self.$translate('YES').then((yes) => {
          self.modalAlert.open({
            message: message,
            buttons: [{ label: no }, { label: yes, callback: () => { self.deleteSocialNetworking(entity); } }]
          });
        });
      });
    });
  }

  clickOnRow(entity, event, col, row) {
    if(col.colDef.clickable === false) return;
    this.edit(entity, event);
  }

  publish(entity, published, callback) {
    entity.published = published;
    self.socialNetworkingService.edit(entity, (response) => {
      self.socialNetworkingNotifier.showSuccessPublishedMessage(published);
      if(callback) callback();
    });
  }

  setGridHeight() {
    this.rowHeight = 170;
    this.$scope.$watch(() => {
      return this.gridData.length;
    }, () => {
      this.$timeout(() => {
        this.$scope.$broadcast('setGridHeight', this.rowHeight);
      });
    });
  }
}

let socialNetworkingGrid = {
  bindings: { 
    gridData: '=',
    totalCount: '=',
    sortByEnum: '=',
    sortBy: '=',
    sortByDirection: '='
  },
  controller: SocialNetworkingGridController,
  templateUrl: template
};

export default socialNetworkingGrid