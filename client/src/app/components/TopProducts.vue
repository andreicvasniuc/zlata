<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import { useLocalePath } from '../locale'
import ItemGrid, { type GridItem } from './ItemGrid.vue'
import LoadingIcon from './LoadingIcon.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const { data, loading } = useLoader(async () => (await productsApi.topList()).products ?? [])

const items = computed<GridItem[]>(() =>
  (data.value ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    url: `/${product.collection_slug}/${product.slug}`,
    image: product.cover_image?.url,
  })),
)
</script>

<template>
  <LoadingIcon v-show="loading" />

  <section v-show="!loading" class="top-products site-container" aria-labelledby="top-products-heading">
    <div class="top-products-head">
      <div>
        <p class="eyebrow">{{ t('CURATED_SELECTION') }}</p>
        <h2 id="top-products-heading" class="fh5co-heading">{{ t('TOP_DRESSES') }}</h2>
      </div>
      <RouterLink :to="localePath('/collections')" class="text-link">{{ t('VIEW_ALL_COLLECTIONS') }} →</RouterLink>
    </div>

    <ItemGrid :items="items" wide />
  </section>
</template>

<style>
.top-products {
  padding-top: 64px;
  padding-bottom: 80px;
}
.top-products-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  margin-bottom: 36px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border);
}
.top-products-head h2 {
  margin: 0;
}
</style>
