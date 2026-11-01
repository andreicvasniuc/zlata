import { createRouter, createWebHistory, type RouteComponent, type RouteRecordRaw } from 'vue-router'
import { whenLoaded } from './composables/useLoader'

export const appBase = (): string => document.querySelector<HTMLMetaElement>('meta[name="app-base"]')?.content ?? '/'

type Loader = () => Promise<RouteComponent> | RouteComponent

export interface PageComponents {
  layout: Loader
  home: Loader
  collectionList: Loader
  contacts: Loader
  about: Loader
  collection: Loader
  product: Loader
}

const lazyComponents: PageComponents = {
  layout: () => import('./layouts/AppLayout.vue'),
  home: () => import('./views/HomeView.vue'),
  collectionList: () => import('./views/CollectionListView.vue'),
  contacts: () => import('./views/ContactsView.vue'),
  about: () => import('./views/AboutView.vue'),
  collection: () => import('./views/CollectionView.vue'),
  product: () => import('./views/ProductView.vue'),
}

// Same paths as the AngularJS site, also with a locale in front (`/ua/collections`). The two trees are separate
// records because `/:locale?/:collection` would otherwise claim `/ua` as a collection called "ua". `meta.page` tells
// the pages apart regardless of the tree.
export function buildRoutes(components: PageComponents = lazyComponents): RouteRecordRaw[] {
  const pages = (suffix: string): RouteRecordRaw[] => [
    { path: '', name: `home${suffix}`, meta: { page: 'home' }, component: components.home },
    {
      path: 'collections',
      name: `collections${suffix}`,
      meta: { page: 'collections' },
      component: components.collectionList,
    },
    {
      path: 'accessories',
      name: `accessories${suffix}`,
      meta: { page: 'accessories' },
      component: components.collectionList,
    },
    { path: 'contacts', name: `contacts${suffix}`, meta: { page: 'contacts' }, component: components.contacts },
    { path: 'about', name: `about${suffix}`, meta: { page: 'about' }, component: components.about },
    {
      path: ':collection',
      name: `collection${suffix}`,
      meta: { page: 'collection' },
      component: components.collection,
    },
    {
      path: ':collection/:product',
      name: `product${suffix}`,
      meta: { page: 'product' },
      component: components.product,
    },
  ]

  return [
    { path: '/', component: components.layout, children: pages('') },
    { path: '/:locale(en|ua|ru|ro)', component: components.layout, children: pages('-locale') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ]
}

export function createAppRouter(history = createWebHistory(appBase())) {
  return createRouter({
    history,
    // Back / Forward return to where the visitor was, once the page content has arrived from the API
    scrollBehavior: (_to, _from, saved) => (saved ? whenLoaded().then(() => saved) : { top: 0 }),
    routes: buildRoutes(),
  })
}
