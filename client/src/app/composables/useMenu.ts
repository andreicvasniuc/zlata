import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export interface MenuItem {
  name: string
  // path without the locale prefix
  url: string
  list?: MenuItem[]
}

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/

// Same menu as the old site: Home, Catalog (Collections, Accessories), Contacts.
export function useMenu() {
  const { t } = useI18n()
  const route = useRoute()

  const menu = computed<MenuItem[]>(() => [
    { name: t('HOME'), url: '/' },
    {
      name: t('CATALOG'),
      url: '/collections',
      list: [
        { name: t('COLLECTIONS'), url: '/collections' },
        { name: t('ACCESSORIES'), url: '/accessories' },
      ],
    },
    { name: t('CONTACTS'), url: '/contacts' },
  ])

  const currentPath = computed(() => route.path.replace(LOCALE_PREFIX, '') || '/')
  const isActive = (item: MenuItem) => item.url === currentPath.value

  return { menu, isActive }
}
