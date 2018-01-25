class SocialNetworkingResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/social_networkings/:id`, { id: '@id', locale: '@locale' }, {
        get: { method: 'GET' },
        update: { method: 'PUT' },
        search: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/social_networkings/search` },
        uploadImage: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/social_networkings/:id/upload_image` }
    });
  }
}

export default SocialNetworkingResource