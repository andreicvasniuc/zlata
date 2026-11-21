<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import type { BreadcrumbItem } from './BreadcrumbNav.vue'
import HeroSlider from './HeroSlider.vue'
import LoadingIcon from './LoadingIcon.vue'
import PageHeading from './PageHeading.vue'

defineProps<{
  heading?: string
  intro?: string
  breadcrumb?: BreadcrumbItem[]
  loading?: boolean
  // the home page: the slider runs under a transparent header instead of the page heading
  isSliderVisible?: boolean
  // only the breadcrumb above the content, which has its own heading
  compactHeading?: boolean
}>()
</script>

<template>
  <AppHeader :overlay="isSliderVisible" />

  <main id="main" class="page" :class="{ 'page--overlay': isSliderVisible }" tabindex="-1">
    <HeroSlider v-if="isSliderVisible" />
    <PageHeading v-else :title="heading" :intro="intro" :breadcrumb="breadcrumb" :compact="compactHeading" />

    <LoadingIcon v-if="loading" />
    <div v-show="!loading" class="page__content">
      <slot />
    </div>
  </main>

  <AppFooter />
</template>
