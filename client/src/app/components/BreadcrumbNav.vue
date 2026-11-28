<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

export interface BreadcrumbItem {
  name: string
  // path without the locale prefix; the last item has none
  url?: string
}

defineProps<{ items: BreadcrumbItem[] }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <nav :aria-label="t('BREADCRUMB')">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <RouterLink :to="localePath('/')" :title="t('HOME')">{{ t('HOME') }}</RouterLink>
      </li>
      <li v-for="item in items" :key="item.name" class="breadcrumb-item" :class="{ active: !item.url }">
        <RouterLink v-if="item.url" :to="localePath(item.url)" :title="item.name">{{ item.name }}</RouterLink>
        <span v-else aria-current="page">{{ item.name }}</span>
      </li>
    </ol>
  </nav>
</template>

<style>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.page-band.compact .breadcrumb {
  justify-content: flex-start;
}
.breadcrumb-item + .breadcrumb-item::before {
  margin: 0 10px;
  color: var(--color-ink-soft);
  content: '/';
}
.breadcrumb-item.active {
  color: var(--color-ink);
}
.breadcrumb a:hover {
  color: var(--color-ink);
}
</style>
