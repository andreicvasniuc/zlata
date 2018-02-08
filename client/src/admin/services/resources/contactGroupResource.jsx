class ContactGroupResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/contact_groups/:id`, { id: '@id', locale: '@locale' }, {
        get: { method: 'GET' },
        update: { method: 'PUT' },
        search: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/contact_groups/search` },
        list: { method: 'GET', url: `${env.getApiUrl()}/:locale/admin/contact_groups/list` }
    });
  }
}

export default ContactGroupResource