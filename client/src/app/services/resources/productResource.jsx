class ProductResource {
  constructor($resource, env) {
    return $resource(`${env.getApiUrl()}/:locale/api/products/:id`, { id: '@id', locale: '@locale' }, {
        topList: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/products/top_list`, cache : true }//,
        // dresses: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/products/dresses` },
        // accessories: { method: 'GET', url: `${env.getApiUrl()}/:locale/api/products/accessories` }
    });
  }
}

export default ProductResource