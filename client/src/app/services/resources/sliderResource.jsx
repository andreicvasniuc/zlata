class SliderResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/sliders/:id`, { id: '@id', locale: '@locale' }, {
        home: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/sliders/home`, cache : true }
    });
  }
}

export default SliderResource