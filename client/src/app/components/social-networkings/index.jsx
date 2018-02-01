import template from './template.html';

class SocialNetworkingsController {
  constructor($timeout, socialNetworkingService) {
    this.$timeout = $timeout;
    this.socialNetworkingService = socialNetworkingService;

    this.loadSocialNetworkings();
  }

  loadSocialNetworkings() {
    this.isLoadingSpinner = true;

    this.socialNetworkingService.list((response) => {
      this.socialNetworkings = response.social_networkings || [];
      this.$timeout(() => this.isLoadingSpinner = false, 50);
    });
  }
}

let socialNetworkings = {
  bindings: {},
  controller: SocialNetworkingsController,
  templateUrl: template
};

export default socialNetworkings