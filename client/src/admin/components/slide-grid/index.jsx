import './style.styl';

import template from './template.html';
import gridActionCell from './grid-action-cell.html';
import gridPublishedCell from './grid-published-cell.html';
import gridImageCell from './grid-image-cell.html';

class SlideGridController {
  constructor($scope, $rootScope, $timeout, $translate, slideService, slideNotifier, modalAlert) {
    self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.slideService = slideService;
    this.slideNotifier = slideNotifier;
    this.modalAlert = modalAlert;

    this.createColumnDefinitions();
    this.createCallbacks();
    this.setGridHeight();
  }

  createColumnDefinitions() {
    this.columnDefinitions = [
    {
          field: 'image',
          displayName: "IMAGE",
          headerCellFilter: "translate",
          cellTemplate: gridImageCell,
          clickable: false,
          width: 120
      },
      {
          field: 'title',
          displayName: 'TITLE',
          headerCellFilter: "translate",
          sortable: true
      },
      {
          field: 'link_text',
          displayName: 'LINK_TEXT',
          headerCellFilter: "translate",
          sortable: true
      },
      {
          field: 'link_url',
          displayName: 'LINK_URL',
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

  editSlide(entity, openImageUploadingTab) {
    self.slideService.get(entity, (response) => {
      self.$rootScope.$broadcast('openSlideEditorPopup', response, openImageUploadingTab);
    });
  }

  edit(entity, event) {
    self.editSlide(entity);
  }

  upload(entity, event) {
    self.editSlide(entity, true);
  }

  deleteSlide(slide) {
    this.slideService.delete(slide, (response) => {
      this.$scope.$emit('reloadGrid');
      this.slideNotifier.showSuccessDeleteMessage();
    });
  }

  delete(entity, event) {
    self.$translate('DELETE_SLIDE_MESSAGE').then((message) => {
      self.$translate('NO').then((no) => {
        self.$translate('YES').then((yes) => {
          self.modalAlert.open({
            message: message,
            buttons: [{ label: no }, { label: yes, callback: () => { self.deleteSlide(entity); } }]
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
    self.slideService.edit(entity, (response) => {
      self.slideNotifier.showSuccessPublishedMessage(published);
      if(callback) callback();
    });
  }

  setGridHeight() {
    this.$scope.$watch(() => {
      return this.gridData.length;
    }, () => {
      this.$timeout(() => {
        let rowHeight = 170;
        this.$scope.$broadcast('setGridHeight', rowHeight);
      });
    });
  }
}

let slideGrid = {
  bindings: { 
    gridData: '=',
    totalCount: '=',
    sortByEnum: '=',
    sortBy: '=',
    sortByDirection: '='
  },
  controller: SlideGridController,
  templateUrl: template
};

export default slideGrid