class SlideResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/sliders/:sliderId/slides/:id`, { sliderId: '@sliderId', id: '@id', locale: '@locale' }, {
        update: { method: 'PUT' },
        uploadImage: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/sliders/:sliderId/slides/:id/upload_image` }
    });
  }
}

export default SlideResource