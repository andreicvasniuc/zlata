<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Color, ImageFile, Product, Size } from '@shared/types'
import { usePriceLabel } from '../composables/usePriceLabel'
import { useLocalePath } from '../locale'
import ExtraField from './ExtraField.vue'
import ProductAskButtons from './ProductAskButtons.vue'
import ProductGallery from './ProductGallery.vue'

export interface ProductWithExtras extends Omit<Product, 'images'> {
  images: ImageFile[]
  colors: Color[]
  sizes: Size[]
}

const props = defineProps<{ product: ProductWithExtras; collectionName?: string }>()

const { t } = useI18n()
const localePath = useLocalePath()
const label = usePriceLabel()
const priceLabel = computed(() => label(props.product))

// the contact page prefills its message with the name of the product
const inquiryTo = computed(() => ({ path: localePath('/contacts'), query: { product: props.product.name } }))
</script>

<template>
  <article class="item-details">
    <ProductGallery :images="product.images" :alt="product.name" />

    <div class="info">
      <p v-if="collectionName" class="eyebrow">{{ collectionName }}</p>
      <h1>{{ product.name }}</h1>
      <p v-if="priceLabel" class="price" data-testid="product-price">{{ priceLabel }}</p>
      <p v-else class="price price-request">{{ t('PRICE_ON_REQUEST') }}</p>

      <div class="extra-fields">
        <ExtraField label="COLORS" :items="product.colors" />
        <ExtraField label="SIZES" :items="product.sizes" />
      </div>
      <p v-if="product.description" class="description">{{ product.description }}</p>

      <RouterLink :to="inquiryTo" class="btn btn-primary btn-block inquire">
        {{ t('INQUIRE_ABOUT', { name: product.name }) }}
      </RouterLink>
      <ProductAskButtons />
    </div>
  </article>
</template>

<style>
/* two columns in normal flow: the gallery may grow as long as it needs to */
.item-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  box-sizing: border-box;
  max-width: var(--site-width);
  margin: 0 auto;
  padding: 32px 0 64px;
}
.item-details .info {
  box-sizing: border-box;
  padding: 28px 24px;
  background: #fff;
  border: 1px solid var(--color-border);
}
.item-details .info h1 {
  margin-bottom: 12px;
  font-size: 2.6rem;
  line-height: 1.1;
}
.item-details .info .price {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
  font-size: 1.1rem;
  color: var(--color-ink-soft);
}
.item-details .info .extra-fields {
  margin-bottom: 8px;
}
.item-details .info .description {
  margin-bottom: 28px;
  color: var(--color-ink-soft);
  white-space: pre-line;
}

@media (min-width: 992px) {
  .item-details {
    grid-template-columns: minmax(0, 7fr) minmax(340px, 5fr);
    gap: 48px;
    align-items: start;
  }
  .item-details .info {
    position: sticky;
    top: 104px;
    padding: 36px;
  }
  .item-details .info h1 {
    font-size: 42px;
  }
}
</style>
