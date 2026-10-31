<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PageLayout from '../components/PageLayout.vue'
import TopProducts from '../components/TopProducts.vue'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
usePageTitle()
</script>

<template>
  <PageLayout :heading="t('LONG_SITE_NAME')" is-slider-visible>
    <div class="top-products">
      <TopProducts />
    </div>
  </PageLayout>
</template>
