<script setup lang="ts">
import { onBeforeUnmount, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

export interface BreadcrumbItem {
  name: string
  // path without the locale prefix; the last item has none
  url?: string
}

const props = defineProps<{ items: BreadcrumbItem[] }>()

const { t } = useI18n()
const localePath = useLocalePath()

// schema.org BreadcrumbList for search engines, kept in the head while the breadcrumb is on the page
const JSON_LD_ATTRIBUTE = 'data-breadcrumb-jsonld'
let script: HTMLScriptElement | undefined

watchEffect(() => {
  const { origin, pathname } = window.location
  const crumbs = [
    { name: t('HOME'), path: localePath('/') },
    ...props.items.map((item) => ({ name: item.name, path: item.url ? localePath(item.url) : pathname })),
  ]
  script ??= Object.assign(document.createElement('script'), { type: 'application/ld+json' })
  script.setAttribute(JSON_LD_ATTRIBUTE, '')
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.path}`,
    })),
  }).replace(/</g, '\\u003c')
  if (!script.isConnected) document.head.append(script)
})

onBeforeUnmount(() => script?.remove())
</script>

<template>
  <nav class="breadcrumb-nav" :aria-label="t('BREADCRUMB')">
    <ol class="breadcrumb">
      <li>
        <RouterLink :to="localePath('/')">{{ t('HOME') }}</RouterLink>
      </li>
      <li v-for="item in items" :key="item.name" :class="{ active: !item.url }">
        <RouterLink v-if="item.url" :to="localePath(item.url)">{{ item.name }}</RouterLink>
        <span v-else aria-current="page">{{ item.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<style>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 12.5px;
  letter-spacing: 0.04em;
  color: var(--z-muted);
}
.breadcrumb li + li::before {
  content: '/';
  margin: 0 10px;
  color: #b9b1a8;
}
.breadcrumb a {
  transition: color 0.2s ease;
}
.breadcrumb a:hover {
  color: var(--z-ink);
}
.breadcrumb li.active {
  color: var(--z-ink);
}
</style>
