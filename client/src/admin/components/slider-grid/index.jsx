import './style.styl';

import template from './template.html';
import gridActionCell from './grid-action-cell.html';
import gridPublishedCell from './grid-published-cell.html';
import gridLinkCell from './grid-link-cell.html';

class SliderGridController {
  constructor($scope, $rootScope, $timeout, $translate, sliderService, sliderNotifier, modalAlert, slideRouter, routeUrls) {
    self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.sliderService = sliderService;
    this.sliderNotifier = sliderNotifier;
    this.modalAlert = modalAlert;
    this.slideRouter = slideRouter;
    this.routeUrls = routeUrls;
  }

  $onInit() {
    this.createColumnDefinitions();
    this.createCallbacks();
    this.setGridHeight();
  }

  createColumnDefinitions() {
    this.columnDefinitions = [
      {
          field: 'name',
          displayName: 'NAME',
          headerCellFilter: "translate",
          sortable: true
      },
      {
          field: 'autoplay',
          displayName: 'AUTOPLAY',
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
          field: 'slides_count',
          displayName: 'SLIDES_COUNT',
          headerCellFilter: "translate",
          cellTemplate: gridLinkCell,
          cellClass: 'text-center',
          clickable: false,
          width: 180
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
      delete: this.delete,
      clickOnRow: this.clickOnRow,
      publish: this.publish,
      goToSlides: this.goToSlides
    };
  }

  editSlider(entity) {
    self.sliderService.get(entity.slug, (response) => {
      self.$rootScope.$broadcast('openSliderEditorPopup', response);
    });
  }

  edit(entity, event) {
    self.editSlider(entity);
  }

  deleteSlider(slider) {
    this.sliderService.delete(slider, (response) => {
      this.$scope.$emit('reloadGrid');
      this.sliderNotifier.showSuccessDeleteMessage();
    });
  }

  delete(entity, event) {
    self.$translate('DELETE_SLIDER_MESSAGE').then((message) => {
      self.$translate('NO').then((no) => {
        self.$translate('YES').then((yes) => {
          self.modalAlert.open({
            message: message,
            buttons: [{ label: no }, { label: yes, callback: () => { self.deleteSlider(entity); } }]
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
    self.sliderService.edit(entity, (response) => {
      self.sliderNotifier.showSuccessPublishedMessage(published);
      if(callback) callback();
    });
  }

  goToSlides(entity) {
    self.slideRouter.goTo(self.routeUrls.slider_slides, entity.slug);
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

let sliderGrid = {
  bindings: { 
    gridData: '=',
    totalCount: '=',
    sortByEnum: '=',
    sortBy: '=',
    sortByDirection: '='
  },
  controller: SliderGridController,
  templateUrl: template
};

export default sliderGrid