class ContactResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/contacts/:id`, { id: '@id', locale: '@locale' }, {
      list: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/contacts/list`, cache: true }
    });
  }
}

export default ContactResource