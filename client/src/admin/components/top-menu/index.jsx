import template from './template.html';

class TopMenuController {
  constructor($route, dataService) {
    this.$route = $route;
    this.dataService = dataService;
  }

  export() {
    this.dataService.export(response => {
      console.log('export data', response);
      const jsonString = JSON.stringify(response);
      const blob = new Blob([jsonString], { type: 'application/binary'});
      const url = URL.createObjectURL(blob);

      window.open(url);
    },
    data => console.error('export failed', data));
  }

  import() {
    this.dataService.import(response => {
      console.log('import data', response);
    },
    data => console.error('import failed', data));
  }

  alert() {
    alert('it is not implemented yet!');
  }

  logout() {
    sessionStorage.removeItem('auth_token');
    this.$route.reload();
  }
}

let topMenu = {
  bindings: {},
  controller: TopMenuController,
  templateUrl: template
};

export default topMenu