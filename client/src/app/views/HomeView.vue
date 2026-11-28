<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import HeroSlider from '../components/HeroSlider.vue'
import PageLayout from '../components/PageLayout.vue'
import TopProducts from '../components/TopProducts.vue'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
usePageTitle()
</script>

<template>
  <PageLayout bare>
    <!-- the slide titles are headings of their own; the page itself is named for screen readers -->
    <h1 class="sr-only">{{ t('LONG_SITE_NAME') }}</h1>
    <HeroSlider />
    <TopProducts />
  </PageLayout>
</template>
