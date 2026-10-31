<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import PageHeading from '../components/PageHeading.vue'

const { t } = useI18n()

// the old dashboard only showed demo panels; this one is a shortcut page to the sections
const sections = [
  { title: 'COLLECTIONS', path: '/collections' },
  { title: 'PRODUCTS', path: '/products' },
  { title: 'SOCIAL_NETWORKINGS', path: '/social-networkings' },
  { title: 'CONTACT_GROUPS', path: '/contact-groups' },
  { title: 'CONTACTS', path: '/contacts' },
  { title: 'SLIDERS', path: '/sliders' },
  { title: 'SLIDES', path: '/slides' },
]
</script>

<template>
  <PageHeading title="DASHBOARD" />
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="dashboard">
    <RouterLink
      v-for="section in sections"
      :key="section.path"
      :to="section.path"
      class="border border-border bg-white p-6 text-lg text-ink hover:border-accent hover:text-accent"
    >
      {{ t(section.title) }}
    </RouterLink>
  </div>
</template>
