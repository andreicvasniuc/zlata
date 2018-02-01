class SocialNetworkingResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/social_networkings/:id`, { id: '@id', locale: '@locale' }, {
        list: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/social_networkings/list`, cache : true }
    });
  }
}

export default SocialNetworkingResource