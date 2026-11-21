<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import IconShare from '~icons/lucide/share-2'
import IconChat from '~icons/lucide/message-circle'
import type { Color, ImageFile, Product, Size } from '@shared/types'
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { contactsQuery } from '../contacts'
import { useLoader } from '../composables/useLoader'
import { usePriceLabel } from '../composables/usePriceLabel'
import { useLocalePath } from '../locale'
import { useNotifier } from '../stores/notifier'
import ExtraField from './ExtraField.vue'
import FavouriteButton from './FavouriteButton.vue'
import ProductGallery from './ProductGallery.vue'

export interface ProductWithExtras extends Omit<Product, 'images'> {
  images: ImageFile[]
  colors: Color[]
  sizes: Size[]
}

const props = defineProps<{ product: ProductWithExtras; collectionName: string; collectionSlug: string }>()

// The collapsible information blocks under the buttons (the texts are general, the same for every dress).
const SECTIONS = [
  { title: 'DETAILS_FABRIC', text: 'DETAILS_FABRIC_TEXT' },
  { title: 'FITTING_TAILORING', text: 'FITTING_TAILORING_TEXT' },
  { title: 'DELIVERY_PAYMENT', text: 'DELIVERY_PAYMENT_TEXT' },
]

const { t } = useI18n()
const localePath = useLocalePath()
const notifier = useNotifier()
const label = usePriceLabel()

const { data: socialNetworkings } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])
// A personal Telegram link (t.me/name) can carry the dress name as the first message; an invite link (t.me/+…) can't,
// then the question form is used instead.
const telegramLink = computed(() => {
  const url = (socialNetworkings.value ?? []).find((network) =>
    /telegram/i.test(`${network.css_class} ${network.slug}`),
  )?.url
  if (!url || !/^https:\/\/t\.me\/[A-Za-z][A-Za-z0-9_]{3,}\/?$/.test(url)) return undefined
  return `${url.replace(/\/$/, '')}?text=${encodeURIComponent(t('TELEGRAM_DRESS_MESSAGE', { dress: props.product.name }))}`
})

const priceLabel = computed(() => label(props.product))
const url = computed(() => `/${props.collectionSlug}/${props.product.slug}`)
const favourite = computed(() => ({
  id: props.product.id,
  name: props.product.name,
  url: url.value,
  image: props.product.images[0]?.url,
}))
const fittingLink = computed(() => ({
  path: localePath('/contacts'),
  query: contactsQuery('fitting', [props.product.name]),
}))
const questionLink = computed(() => ({
  path: localePath('/contacts'),
  query: contactsQuery('question', [props.product.name]),
}))

async function share() {
  const data = { title: props.product.name, url: window.location.href }
  try {
    if (navigator.share) {
      await navigator.share(data)
    } else {
      await navigator.clipboard.writeText(data.url)
      notifier.success(t('LINK_COPIED'))
    }
  } catch {
    // the visitor closed the share sheet
  }
}

// the fixed "Book a fitting" bar of phones must not cover the end of the page
onMounted(() => document.body.classList.add('has-product-bar'))
onBeforeUnmount(() => document.body.classList.remove('has-product-bar'))
</script>

<template>
  <article class="product wrap">
    <ProductGallery class="product__gallery" :images="product.images" :alt="product.name" />

    <div class="product__info info">
      <RouterLink :to="localePath(`/${collectionSlug}`)" class="eyebrow product__collection">
        {{ collectionName }}
      </RouterLink>
      <h1 class="product__name">{{ product.name }}</h1>
      <p v-if="priceLabel" class="product__price price" data-testid="product-price">{{ priceLabel }}</p>
      <p v-else class="product__price product__price--request">{{ t('PRICE_ON_REQUEST') }}</p>

      <p v-if="product.description" class="product__description description">{{ product.description }}</p>

      <dl v-if="product.colors.length || product.sizes.length" class="product__specs extra-fields">
        <ExtraField label="COLORS" :items="product.colors" swatches />
        <ExtraField label="SIZES" :items="product.sizes" />
      </dl>

      <div class="product__actions">
        <RouterLink :to="fittingLink" class="btn btn--block">{{ t('BOOK_FITTING') }}</RouterLink>
        <a
          v-if="telegramLink"
          :href="telegramLink"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn--ghost btn--block"
        >
          {{ t('ASK_ABOUT_DRESS') }}
        </a>
        <RouterLink v-else :to="questionLink" class="btn btn--ghost btn--block">{{ t('ASK_ABOUT_DRESS') }}</RouterLink>
      </div>

      <div class="product__tools">
        <FavouriteButton :item="favourite" with-label />
        <button type="button" class="product__share" @click="share">
          <IconShare aria-hidden="true" />
          {{ t('SHARE') }}
        </button>
      </div>

      <div class="product__more-list">
        <details v-for="section in SECTIONS" :key="section.title" name="product-info" class="product__more">
          <summary>{{ t(section.title) }}</summary>
          <p>{{ t(section.text) }}</p>
        </details>
      </div>
    </div>

    <div class="product-bar">
      <RouterLink :to="fittingLink" class="btn product-bar__cta">{{ t('BOOK_FITTING') }}</RouterLink>
      <a
        v-if="telegramLink"
        :href="telegramLink"
        target="_blank"
        rel="noopener noreferrer"
        class="product-bar__chat"
        :aria-label="t('ASK_ABOUT_DRESS')"
      >
        <IconChat aria-hidden="true" />
      </a>
      <RouterLink v-else :to="questionLink" class="product-bar__chat" :aria-label="t('ASK_ABOUT_DRESS')">
        <IconChat aria-hidden="true" />
      </RouterLink>
      <FavouriteButton :item="favourite" class="product-bar__favourite" />
    </div>
  </article>
</template>

<style>
.product {
  display: grid;
  gap: 28px;
}
@media (max-width: 1023px) {
  .product {
    padding-left: 0;
    padding-right: 0;
  }
  .product__info {
    padding: 0 var(--z-gutter);
  }
}
@media (min-width: 1024px) {
  .product {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 420px);
    align-items: start;
    gap: clamp(40px, 5vw, 80px);
  }
  .product__info {
    position: sticky;
    top: calc(var(--z-header-h) + 32px);
  }
}

.product__collection {
  display: inline-block;
  transition: color 0.2s ease;
}
.product__collection:hover {
  color: var(--z-ink);
}
.product__name {
  margin: 12px 0 10px;
  font-size: clamp(44px, 5vw, 68px);
  line-height: 1;
  overflow-wrap: anywhere;
}
.product__price {
  margin-bottom: 24px;
  font-size: 18px;
}
.product__price--request {
  font-size: 15px;
  color: var(--z-muted);
}
.product__description {
  margin-bottom: 24px;
  color: #4d4741;
  white-space: pre-line;
}
.product__specs {
  margin: 0 0 8px;
}
.product__actions {
  display: grid;
  gap: 10px;
  padding-top: 24px;
  border-top: 1px solid var(--z-line);
}
.product__tools {
  display: flex;
  gap: 28px;
  margin-top: 18px;
}
.product__share {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--z-muted);
  transition: color 0.2s ease;
}
.product__share:hover {
  color: var(--z-ink);
}
.product__share svg {
  width: 17px;
  height: 17px;
}
.product__more-list {
  margin-top: 28px;
  border-top: 1px solid var(--z-line);
}
.product__more {
  border-bottom: 1px solid var(--z-line);
}
.product__more summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  list-style: none;
  cursor: pointer;
}
.product__more summary::-webkit-details-marker {
  display: none;
}
.product__more summary::after {
  content: '+';
  font-size: 18px;
  font-weight: 300;
}
.product__more[open] summary::after {
  content: '−';
}
.product__more p {
  padding-bottom: 20px;
  font-size: 14px;
  color: var(--z-muted);
}

.product-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  gap: 10px;
  padding: 12px var(--z-gutter) calc(12px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--z-line);
  background: var(--z-bg);
}
.product-bar__cta {
  flex: 1;
}
.product-bar__favourite.favourite-button,
.product-bar__chat {
  display: grid;
  flex: none;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid var(--z-ink);
  border-radius: 0;
  background: transparent;
}
.product-bar__chat svg {
  width: 20px;
  height: 20px;
}
@media (max-width: 1023px) {
  body.has-product-bar {
    padding-bottom: 76px;
  }
}
@media (min-width: 1024px) {
  .product-bar {
    display: none;
  }
}
</style>
