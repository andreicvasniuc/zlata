class ContactResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/contacts/:id`, { id: '@id', locale: '@locale' }, {
      send: { method: 'POST', url: `${env.getApiUrl()}/:locale/api/contacts/send_form` }
    });
  }
}

export default ContactResource