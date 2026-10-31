import { createRouter, createWebHistory, type RouteComponent, type RouteRecordRaw } from 'vue-router'
import { useSession } from '@shared/auth/session'

// Same paths as the AngularJS admin. List screens also exist as `<path>/sort/:sortBy/:sortByDirection/search/:searchText?`
// (two records for the same view, so navigating between them keeps the view mounted).
const listRoutes = (name: string, path: string, component: RouteComponent): RouteRecordRaw[] => [
  { path, name, component },
  { path: `${path}/sort/:sortBy/:sortByDirection/search/:searchText?`, name: `${name}_search`, component },
]

export const adminBase = (): string =>
  document.querySelector<HTMLMetaElement>('meta[name="app-base"]')?.content ?? '/admin/'

export function createAdminRouter() {
  const router = createRouter({
    history: createWebHistory(adminBase()),
    routes: [
      { path: '/login', name: 'login', component: () => import('./views/LoginView.vue') },
      {
        path: '/',
        component: () => import('./layouts/AdminLayout.vue'),
        meta: { requiresLogin: true },
        children: [
          { path: '', name: 'index', component: () => import('./views/DashboardView.vue') },
          { path: 'dashboard', name: 'dashboard', component: () => import('./views/DashboardView.vue') },
          ...listRoutes('collections', 'collections', () => import('./views/CollectionsView.vue')),
          ...listRoutes(
            'collection_products',
            'collection/:collectionId/products',
            () => import('./views/CollectionProductsView.vue'),
          ),
          { path: 'products', name: 'products', component: () => import('./views/ProductsView.vue') },
          ...listRoutes('social_networkings', 'social-networkings', () => import('./views/SocialNetworkingsView.vue')),
          ...listRoutes('contact_groups', 'contact-groups', () => import('./views/ContactGroupsView.vue')),
          ...listRoutes(
            'contact_group_contacts',
            'contact-group/:contactGroupId/contacts',
            () => import('./views/ContactGroupContactsView.vue'),
          ),
          { path: 'contacts', name: 'contacts', component: () => import('./views/ContactsView.vue') },
          ...listRoutes('sliders', 'sliders', () => import('./views/SlidersView.vue')),
          ...listRoutes('slider_slides', 'slider/:sliderId/slides', () => import('./views/SliderSlidesView.vue')),
          { path: 'slides', name: 'slides', component: () => import('./views/SlidesView.vue') },
        ],
      },
      { path: '/:pathMatch(.*)*', redirect: '/collections' },
    ],
  })

  router.beforeEach((to) => {
    const session = useSession()
    if (to.matched.some((record) => record.meta.requiresLogin) && !session.isLoggedIn) {
      session.redirectTo = to.fullPath
      return { name: 'login' }
    }
    // nothing to log in to
    if (to.name === 'login' && session.isLoggedIn) return { path: '/' }
    return true
  })

  return router
}
