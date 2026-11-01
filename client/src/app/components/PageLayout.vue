<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import BreadcrumbNav, { type BreadcrumbItem } from './BreadcrumbNav.vue'
import LoadingIcon from './LoadingIcon.vue'

// Without a `heading` the page brings its own (the home page has a hero).
defineProps<{
  heading?: string
  lead?: string
  breadcrumb?: BreadcrumbItem[]
  loading?: boolean
}>()
</script>

<template>
  <AppHeader />

  <main id="main" tabindex="-1">
    <div v-if="breadcrumb || heading" class="site-container">
      <BreadcrumbNav v-if="breadcrumb" :items="breadcrumb" />
      <div v-if="heading" class="page-header">
        <h1>{{ heading }}</h1>
        <p v-if="lead" class="lead">{{ lead }}</p>
      </div>
    </div>

    <LoadingIcon v-if="loading" />

    <div v-show="!loading" :class="{ 'site-container page-body': heading }">
      <slot />
    </div>
  </main>

  <AppFooter />
</template>
