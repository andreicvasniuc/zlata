<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import { useLocalePath } from '../locale'
import ItemGrid, { type GridItem } from './ItemGrid.vue'
import LoadingIcon from './LoadingIcon.vue'

// the home page shows a short selection, not the whole catalog
const MAX_ITEMS = 8

const { t } = useI18n()
const localePath = useLocalePath()
const { data, loading } = useLoader(async () => (await productsApi.topList()).products ?? [])

const items = computed<GridItem[]>(() =>
  (data.value ?? []).slice(0, MAX_ITEMS).map((product) => ({
    id: product.id,
    name: product.name,
    url: `/${product.collection_slug}/${product.slug}`,
    image: product.cover_image?.url,
  })),
)
</script>

<template>
  <section v-if="items.length" class="featured site-container" aria-labelledby="featured-heading">
    <div class="featured-head">
      <h2 id="featured-heading">{{ t('TOP_DRESSES') }}</h2>
      <RouterLink :to="localePath('/collections')" class="text-link">{{ t('VIEW_ALL_COLLECTIONS') }}</RouterLink>
    </div>

    <ItemGrid :items="items" wide />
  </section>
  <LoadingIcon v-else-if="loading" />
</template>

<style>
.featured {
  padding-top: 64px;
  padding-bottom: 64px;
}
.featured-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px 24px;
  margin-bottom: 28px;
}
.featured-head h2 {
  margin: 0;
}
</style>
