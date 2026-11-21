<script setup lang="ts">
import BreadcrumbNav, { type BreadcrumbItem } from './BreadcrumbNav.vue'

defineProps<{
  title?: string
  intro?: string
  breadcrumb?: BreadcrumbItem[]
  // only the breadcrumb: the page shows its own heading (the product page)
  compact?: boolean
}>()

// keeps the heading's height while the page has no title yet
const NBSP = String.fromCharCode(160)
</script>

<template>
  <header class="page-heading wrap" :class="{ 'page-heading--compact': compact }">
    <BreadcrumbNav v-if="breadcrumb" :items="breadcrumb" />
    <template v-if="!compact">
      <h1 class="page-heading__title">{{ title || NBSP }}</h1>
      <p v-if="intro" class="page-heading__intro">{{ intro }}</p>
    </template>
  </header>
</template>

<style>
.page-heading {
  padding-top: clamp(28px, 5vw, 64px);
  padding-bottom: clamp(28px, 4vw, 48px);
}
.page-heading--compact {
  padding-top: 24px;
  padding-bottom: 24px;
}
.page-heading__title {
  margin-top: 18px;
  font-size: clamp(44px, 6vw, 80px);
  line-height: 1;
  overflow-wrap: anywhere;
}
.page-heading__intro {
  max-width: 560px;
  margin-top: 16px;
  font-size: 16px;
  color: var(--z-muted);
}
</style>
