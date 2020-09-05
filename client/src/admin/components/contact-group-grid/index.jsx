import './style.styl';

import template from './template.html';
import gridActionCell from './grid-action-cell.html';
import gridPublishedCell from './grid-published-cell.html';
import gridLinkCell from './grid-link-cell.html';

class ContactGroupGridController {
  constructor($scope, $rootScope, $timeout, $translate, contactGroupService, contactGroupNotifier, modalAlert, contactRouter, routeUrls) {
    self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.contactGroupService = contactGroupService;
    this.contactGroupNotifier = contactGroupNotifier;
    this.modalAlert = modalAlert;
    this.contactRouter = contactRouter;
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
          field: 'updated_at',
          displayName: 'EDIT_DATE',
          headerCellFilter: "translate",
          cellFilter: 'date:"dd/MM/yyyy"',
          sortable: true,
          width: 200
      },
      {
          field: 'contacts_count',
          displayName: 'CONTACTS_COUNT',
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
      goToContacts: this.goToContacts
    };
  }

  editContactGroup(entity) {
    self.contactGroupService.get(entity.slug, (response) => {
      self.$rootScope.$broadcast('openContactGroupEditorPopup', response);
    });
  }

  edit(entity, event) {
    self.editContactGroup(entity);
  }

  deleteContactGroup(contactGroup) {
    this.contactGroupService.delete(contactGroup, (response) => {
      this.$scope.$emit('reloadGrid');
      this.contactGroupNotifier.showSuccessDeleteMessage();
    });
  }

  delete(entity, event) {
    self.$translate('DELETE_CONTACT_GROUP_MESSAGE').then((message) => {
      self.$translate('NO').then((no) => {
        self.$translate('YES').then((yes) => {
          self.modalAlert.open({
            message: message,
            buttons: [{ label: no }, { label: yes, callback: () => { self.deleteContactGroup(entity); } }]
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
    self.contactGroupService.edit(entity, (response) => {
      self.contactGroupNotifier.showSuccessPublishedMessage(published);
      if(callback) callback();
    });
  }

  goToContacts(entity) {
    self.contactRouter.goTo(self.routeUrls.contact_group_contacts, entity.slug);
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

let contactGroupGrid = {
  bindings: { 
    gridData: '=',
    totalCount: '=',
    sortByEnum: '=',
    sortBy: '=',
    sortByDirection: '='
  },
  controller: ContactGroupGridController,
  templateUrl: template
};

export default contactGroupGrid