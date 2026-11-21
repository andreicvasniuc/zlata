<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import { usePriceLabel } from '../composables/usePriceLabel'
import { productGridItem } from '../product'
import { vReveal } from '../reveal'
import ItemGrid from './ItemGrid.vue'
import LoadingIcon from './LoadingIcon.vue'

const { t } = useI18n()
const priceLabel = usePriceLabel()
const { data, loading } = useLoader(async () => (await productsApi.topList()).products ?? [])

const BESTSELLERS = 8

const items = computed(() =>
  (data.value ?? [])
    .slice(0, BESTSELLERS)
    .map((product) => productGridItem(product, product.collection_slug, priceLabel(product))),
)
</script>

<template>
  <section v-reveal class="section section--flush-top top-products" aria-labelledby="top-products-title">
    <div class="wrap">
      <div class="section-head">
        <div>
          <p class="eyebrow">{{ t('MOST_LOVED') }}</p>
          <h2 id="top-products-title">{{ t('TOP_DRESSES') }}</h2>
        </div>
      </div>
      <LoadingIcon v-if="loading" />
      <ItemGrid v-else :items="items" />
    </div>
  </section>
</template>
