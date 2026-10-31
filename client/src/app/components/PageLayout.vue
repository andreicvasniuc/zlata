<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import BreadcrumbNav, { type BreadcrumbItem } from './BreadcrumbNav.vue'
import LoadingIcon from './LoadingIcon.vue'

defineProps<{
  heading?: string
  breadcrumb?: BreadcrumbItem[]
  loading?: boolean
  // wraps the content in the centered 10-column block
  centered?: boolean
  isSliderVisible?: boolean
}>()
</script>

<template>
  <AppHeader :heading="heading" :is-slider-visible="isSliderVisible" />

  <div id="fh5co-main" :class="{ 'no-margin-top': isSliderVisible }">
    <BreadcrumbNav v-if="breadcrumb" :items="breadcrumb" />

    <LoadingIcon v-show="loading" />

    <div v-show="!loading" :class="{ 'col-md-10 col-md-offset-1 clearfix': centered }">
      <slot />
    </div>

    <section id="fh5co-newsletter">
      <div class="bs-container"></div>
    </section>

    <AppFooter />
  </div>
</template>
