class HomeController {
  constructor($translate, titleTranslateId) {
    this.getTranslation($translate, titleTranslateId);
  }

  getTranslation($translate, titleTranslateId) {
    $translate(titleTranslateId).then((translation) => this.title = translation);
  }
}

export default HomeController