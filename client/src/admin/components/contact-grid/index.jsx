import './style.styl';

import template from './template.html';
import gridActionCell from './grid-action-cell.html';
import gridPublishedCell from './grid-published-cell.html';

class ContactGridController {
  constructor($scope, $rootScope, $timeout, $translate, contactService, contactNotifier, modalAlert) {
    self = this;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.contactService = contactService;
    this.contactNotifier = contactNotifier;
    this.modalAlert = modalAlert;

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
      publish: this.publish
    };
  }

  editContact(entity) {
    self.contactService.get(entity, (response) => {
      self.$rootScope.$broadcast('openContactEditorPopup', response);
    });
  }

  edit(entity, event) {
    self.editContact(entity);
  }

  deleteContact(contact) {
    this.contactService.delete(contact, (response) => {
      this.$scope.$emit('reloadGrid');
      this.contactNotifier.showSuccessDeleteMessage();
    });
  }

  delete(entity, event) {
    self.$translate('DELETE_CONTACT_MESSAGE').then((message) => {
      self.$translate('NO').then((no) => {
        self.$translate('YES').then((yes) => {
          self.modalAlert.open({
            message: message,
            buttons: [{ label: no }, { label: yes, callback: () => { self.deleteContact(entity); } }]
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
    self.contactService.edit(entity, (response) => {
      self.contactNotifier.showSuccessPublishedMessage(published);
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

let contactGrid = {
  bindings: { 
    gridData: '=',
    totalCount: '=',
    sortByEnum: '=',
    sortBy: '=',
    sortByDirection: '='
  },
  controller: ContactGridController,
  templateUrl: template
};

export default contactGrid