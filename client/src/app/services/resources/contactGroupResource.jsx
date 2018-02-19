class ContactGroupResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/contact_groups/:id`, { id: '@id', locale: '@locale' }, {
      list: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/contact_groups/list`, cache: true }
    });
  }
}

export default ContactGroupResource