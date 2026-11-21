<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { slidersApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import SlideCarousel from './SlideCarousel.vue'

const { t } = useI18n()
const { data: slider, loading } = useLoader(async () => (await slidersApi.home()).slider ?? undefined)
const slides = computed(() => (slider.value?.slides ?? []).filter((slide) => slide.published !== false))
</script>

<template>
  <section class="home-hero" :aria-label="t('LONG_SITE_NAME')">
    <!-- the page's only h1; the slides have h2 titles -->
    <h1 class="sr-only">{{ t('LONG_SITE_NAME') }}</h1>
    <div v-if="loading" class="hero hero--placeholder"></div>
    <SlideCarousel v-else-if="slides.length" :slides="slides" :autoplay="slider?.autoplay" />
  </section>
</template>

<style>
.home-hero {
  /* without slides the transparent header still needs a dark backdrop */
  min-height: var(--z-header-h);
  background: var(--z-ink);
}
.hero--placeholder {
  background: linear-gradient(120deg, #2a2624, #1c1a19);
}
</style>
