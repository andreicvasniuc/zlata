class ContactResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/contact_groups/:contactGroupId/contacts/:id`, { contactGroupId: '@contactGroupId', id: '@id', locale: '@locale' }, {
        update: { method: 'PUT' }
    });
  }
}

export default ContactResource