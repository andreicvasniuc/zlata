class SliderResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/sliders/:id`, { id: '@id', locale: '@locale' }, {
        get: { method: 'GET' },
        update: { method: 'PUT' },
        search: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/sliders/search` },
        list: { method: 'GET', url: `${env.getApiUrl()}/:locale/admin/sliders/list` }
    });
  }
}

export default SliderResource