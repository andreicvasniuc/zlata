class DataResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/admin/data`, { locale: '@locale' }, {
        export: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/data/export` },
        import: { method: 'POST', url: `${env.getApiUrl()}/:locale/admin/data/import` }
    });
  }
}

export default DataResource