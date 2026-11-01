<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconArrowRight from '~icons/lucide/arrow-right'
import type { Color, ImageFile, Product, Size } from '@shared/types'
import { usePriceLabel } from '../composables/usePriceLabel'
import { useLocalePath } from '../locale'
import ProductGallery from './ProductGallery.vue'

export interface ProductWithExtras extends Omit<Product, 'images'> {
  images: ImageFile[]
  colors: Color[]
  sizes: Size[]
}

const props = defineProps<{
  product: ProductWithExtras
  collection: { slug: string; name: string; has_accessories?: boolean }
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const label = usePriceLabel()
const priceLabel = computed(() => label(props.product))

// size and color are optional: a chosen one travels with the enquiry (ids only, the contact page checks them)
const sizeId = ref<string>()
const colorId = ref<string>()
const toggleSize = (id: string) => (sizeId.value = sizeId.value === id ? undefined : id)
const toggleColor = (id: string) => (colorId.value = colorId.value === id ? undefined : id)

const enquiryTo = computed(() => ({
  path: localePath('/contacts'),
  query: {
    collection: props.collection.slug,
    product: props.product.slug,
    ...(sizeId.value && { size: sizeId.value }),
    ...(colorId.value && { color: colorId.value }),
  },
}))
const enquiryLabel = computed(() => t(props.collection.has_accessories ? 'ENQUIRE_ITEM' : 'ENQUIRE_DRESS'))

// the enquiry bar sticks to the bottom of narrow screens: the footer needs room above it
onMounted(() => document.body.classList.add('has-enquiry-bar'))
onBeforeUnmount(() => document.body.classList.remove('has-enquiry-bar'))
</script>

<template>
  <article class="product site-container">
    <ProductGallery :images="product.images" :alt="product.name" />

    <div class="product-info">
      <p class="eyebrow">{{ collection.name }}</p>
      <h1>{{ product.name }}</h1>
      <p v-if="priceLabel" class="price" data-testid="product-price">{{ priceLabel }}</p>
      <p v-if="product.description" class="description">{{ product.description }}</p>

      <div v-if="product.colors.length" class="option-group" role="group" aria-labelledby="option-color">
        <span id="option-color" class="option-label">{{ t('COLOR') }}</span>
        <button
          v-for="color in product.colors"
          :key="color.id"
          type="button"
          class="option-chip"
          :aria-pressed="colorId === color.id"
          @click="toggleColor(color.id)"
        >
          {{ color.name }}
        </button>
      </div>

      <div v-if="product.sizes.length" class="option-group" role="group" aria-labelledby="option-size">
        <span id="option-size" class="option-label">{{ t('SIZE') }}</span>
        <button
          v-for="size in product.sizes"
          :key="size.id"
          type="button"
          class="option-chip"
          :aria-pressed="sizeId === size.id"
          @click="toggleSize(size.id)"
        >
          {{ size.name }}
        </button>
      </div>

      <p v-if="product.colors.length || product.sizes.length" class="option-hint">{{ t('ENQUIRY_SIZE_HINT') }}</p>

      <RouterLink :to="enquiryTo" class="btn btn-primary btn-block enquire-inline">
        {{ enquiryLabel }}
        <IconArrowRight class="size-5" aria-hidden="true" />
      </RouterLink>
      <p class="ask-about">
        <RouterLink :to="enquiryTo" class="text-link">{{ t('ASK_ABOUT', { name: product.name }) }}</RouterLink>
      </p>

      <slot />
    </div>

    <div class="enquiry-bar">
      <RouterLink :to="enquiryTo" class="btn btn-primary btn-block">
        {{ enquiryLabel }}
        <IconArrowRight class="size-5" aria-hidden="true" />
      </RouterLink>
    </div>
  </article>
</template>

<style>
.product {
  display: grid;
  gap: 24px;
  padding-top: 16px;
  padding-bottom: 64px;
}
.product-info h1 {
  margin-bottom: 8px;
}
.product-info .price {
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: var(--color-ink-soft);
}
.product-info .description {
  white-space: pre-line;
  color: var(--color-ink-soft);
}

.option-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}
.option-label {
  flex-basis: 100%;
  font-size: 0.95rem;
}
.option-chip {
  min-width: 48px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid #8d857a;
  background: transparent;
}
.option-chip:hover {
  border-color: var(--color-ink);
}
.option-chip[aria-pressed='true'] {
  border-color: var(--color-ink);
  background: var(--color-sand);
  box-shadow: inset 0 0 0 1px var(--color-ink);
}
.option-hint {
  margin: 12px 0 24px;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.product-info .ask-about {
  margin: 16px 0 24px;
}

/* mobile: the enquiry action is the persistent bar */
.enquire-inline {
  display: none;
}
.enquiry-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 90;
  padding: 12px var(--site-gutter) calc(12px + env(safe-area-inset-bottom));
  background: var(--color-ivory);
  border-top: 1px solid var(--color-line);
}
body.has-enquiry-bar .site-footer {
  padding-bottom: calc(96px + env(safe-area-inset-bottom));
}

@media (min-width: 769px) {
  .enquire-inline {
    display: flex;
  }
  .enquiry-bar {
    display: none;
  }
  body.has-enquiry-bar .site-footer {
    padding-bottom: 32px;
  }
}
@media (min-width: 992px) {
  .product {
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 64px;
    align-items: start;
  }
  .product-info {
    position: sticky;
    top: calc(var(--site-header-height) + 24px);
    padding-top: 24px;
  }
}
</style>
