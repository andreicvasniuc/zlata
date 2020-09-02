class DataService {
  constructor(dataResource, localeService) {
    this.dataResource = dataResource;
    this.localeService = localeService;
  }

  export(successCallback, errorCallback){
    this.dataResource.export({ locale: this.localeService.get() }, successCallback, errorCallback);
  }

  import(successCallback, errorCallback){
    this.dataResource.import({ locale: this.localeService.get() }, successCallback, errorCallback);
  }
}

export default DataService