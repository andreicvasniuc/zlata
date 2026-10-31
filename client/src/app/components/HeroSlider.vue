<script setup lang="ts">
import { slidersApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import LoadingIcon from './LoadingIcon.vue'
import SlideCarousel from './SlideCarousel.vue'

const { data: slider, loading } = useLoader(async () => (await slidersApi.home()).slider ?? undefined)
</script>

<template>
  <section class="slider">
    <LoadingIcon v-if="loading" />
    <SlideCarousel
      v-else-if="slider && slider.slides && slider.slides.length"
      :slides="slider.slides.filter((slide) => slide.published !== false)"
      :autoplay="slider.autoplay"
    />
  </section>
</template>

<style>
@media screen and (max-width: 768px) {
  .slider {
    margin-top: 45px;
  }
}
</style>
