<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import BreadcrumbNav, { type BreadcrumbItem } from './BreadcrumbNav.vue'
import LoadingIcon from './LoadingIcon.vue'

defineProps<{
  heading?: string
  breadcrumb?: BreadcrumbItem[]
  loading?: boolean
  // breadcrumbs only, no heading band: the product page starts with the gown (previous / next goes in `aside`)
  compact?: boolean
  // no header band and no content width: the page lays itself out (the home page)
  bare?: boolean
}>()
</script>

<template>
  <AppHeader />

  <main id="main" tabindex="-1">
    <div v-if="!bare" class="page-band" :class="{ compact }">
      <div class="site-container">
        <div class="page-band-row">
          <BreadcrumbNav v-if="breadcrumb" :items="breadcrumb" />
          <slot name="aside" />
        </div>
        <h1 v-if="heading && !compact">{{ heading }}</h1>
      </div>
    </div>

    <LoadingIcon v-show="loading" />

    <div v-show="!loading" :class="{ 'page-content': !bare && !compact }">
      <div :class="{ 'site-container': !bare }">
        <slot />
      </div>
    </div>
  </main>

  <AppFooter />
</template>

<style>
.page-band-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px 24px;
}
.page-band.compact .page-band-row {
  justify-content: space-between;
}
.page-content {
  padding-top: 48px;
}
#main {
  outline: none;
}
</style>
