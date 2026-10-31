<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { dataApi } from '@shared/api/resources/data'
import { useSession } from '@shared/auth/session'
import IconMenu from '~icons/lucide/menu'
import IconDownload from '~icons/lucide/download'
import IconLogout from '~icons/lucide/log-out'
import LanguageSelector from '../components/LanguageSelector.vue'
import { useNotify } from '../composables/useNotify'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const session = useSession()
const notify = useNotify()
const menuOpen = ref(false)

const navigation = [
  { title: 'DASHBOARD', path: '/dashboard' },
  { title: 'COLLECTIONS', path: '/collections' },
  { title: 'PRODUCTS', path: '/products' },
  { title: 'SOCIAL_NETWORKINGS', path: '/social-networkings' },
  { title: 'CONTACT_GROUPS', path: '/contact-groups' },
  { title: 'CONTACTS', path: '/contacts' },
  { title: 'SLIDERS', path: '/sliders' },
  { title: 'SLIDES', path: '/slides' },
]

// `/collection/x/products` belongs to PRODUCTS, `/slider/x/slides` to SLIDES, and so on
const nested: Record<string, string> = {
  '/collection/': '/products',
  '/contact-group/': '/contacts',
  '/slider/': '/slides',
}
const isActive = (path: string) => {
  const parent = Object.entries(nested).find(([prefix]) => route.path.startsWith(prefix))
  if (parent) return parent[1] === path
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function exportData() {
  try {
    const { data } = await dataApi.export()
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `zlata-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
  } catch {
    notify.error('EXPORT_FAILED')
  }
}

function logout() {
  session.logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="fixed inset-x-0 top-0 z-40 flex h-[51px] items-center border-b border-border bg-[#f8f8f8] px-4">
      <button
        type="button"
        class="mr-3 cursor-pointer md:hidden"
        :aria-label="t('ADMINISTRATION')"
        @click="menuOpen = !menuOpen"
      >
        <IconMenu class="size-5" />
      </button>
      <RouterLink to="/dashboard" class="text-lg text-ink">{{ t('ADMINISTRATION') }}</RouterLink>
      <div class="ml-auto flex items-center gap-4">
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1 text-sm"
          data-testid="export"
          @click="exportData"
        >
          <IconDownload class="size-4" /> {{ t('EXPORT') }}
        </button>
        <button
          type="button"
          class="flex cursor-pointer items-center gap-1 text-sm"
          data-testid="logout"
          @click="logout"
        >
          <IconLogout class="size-4" /> {{ t('LOGOUT') }}
        </button>
        <LanguageSelector />
      </div>
    </header>

    <nav
      class="fixed top-[51px] bottom-0 left-0 z-30 w-[250px] overflow-y-auto border-r border-border bg-[#f8f8f8] md:block"
      :class="menuOpen ? 'block' : 'hidden'"
      data-testid="sidebar"
    >
      <ul>
        <li v-for="item in navigation" :key="item.path">
          <RouterLink
            :to="item.path"
            class="block border-b border-border px-4 py-3 text-ink hover:bg-surface"
            :class="{ 'bg-surface font-normal text-accent': isActive(item.path) }"
            @click="menuOpen = false"
          >
            {{ t(item.title) }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <main class="px-6 pt-[51px] md:ml-[250px]">
      <RouterView />
    </main>
  </div>
</template>
