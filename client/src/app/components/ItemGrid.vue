<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'
import type { FavouriteItem } from '../stores/favourites'
import FavouriteButton from './FavouriteButton.vue'

export interface GridItem {
  id: string
  name: string
  // path without the locale prefix
  url: string
  image?: string
  // a second picture, shown on hover
  hoverImage?: string
  // e.g. "from 1 200 €"; products without one show "Price on request"
  price?: string
  // recent product: shows the "New" label
  isNew?: boolean
  // shows the heart button
  favourite?: FavouriteItem
}

// `product`: 2 / 3 / 4 columns of 3:4 pictures; `collection`: 2 / 3 columns of 4:5 pictures.
// With `pageSize` the grid shows that many items and a "Load more" button for the rest.
const props = withDefaults(
  defineProps<{ items: GridItem[]; variant?: 'product' | 'collection'; pageSize?: number }>(),
  {
    variant: 'product',
    pageSize: undefined,
  },
)

const { t } = useI18n()
const localePath = useLocalePath()

const limit = ref(props.pageSize ?? Infinity)
const visible = computed(() => props.items.slice(0, limit.value))
const hasMore = computed(() => props.items.length > visible.value.length)

function loadMore() {
  limit.value += props.pageSize ?? Infinity
}
</script>

<template>
  <div class="item-grid" :class="`item-grid--${variant}`">
    <ul v-if="items.length" class="item-grid__list">
      <li v-for="(item, index) in visible" :key="item.id" class="item-card">
        <RouterLink :to="localePath(item.url)" class="item-card__link">
          <span class="item-card__media">
            <img
              v-if="item.image"
              class="item-card__image"
              :src="item.image"
              :alt="item.name"
              :loading="index < 4 ? 'eager' : 'lazy'"
              decoding="async"
            />
            <img
              v-if="item.hoverImage"
              class="item-card__image item-card__image--hover"
              :src="item.hoverImage"
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span v-if="item.isNew" class="item-card__badge">{{ t('NEW') }}</span>
          </span>
          <h3 class="item-card__name">{{ item.name }}</h3>
          <p
            v-if="variant === 'product'"
            class="item-card__price"
            :class="{ 'item-card__price--request': !item.price }"
          >
            {{ item.price || t('PRICE_ON_REQUEST') }}
          </p>
        </RouterLink>
        <FavouriteButton v-if="item.favourite" :item="item.favourite" class="item-card__favourite" />
      </li>
    </ul>
    <p v-else class="item-grid__empty">{{ t('NO_RECORDS_FOUND') }}</p>

    <div v-if="hasMore" class="item-grid__more">
      <p class="eyebrow">{{ t('SHOWING_OF', { shown: visible.length, total: items.length }) }}</p>
      <button type="button" class="btn btn--ghost" @click="loadMore">{{ t('LOAD_MORE') }}</button>
    </div>
  </div>
</template>

<style>
.item-grid__list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .item-grid__list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 44px 24px;
  }
}
@media (min-width: 1200px) {
  .item-grid--product .item-grid__list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.item-card {
  position: relative;
}
.item-card__link {
  display: block;
}
.item-card__media {
  position: relative;
  display: block;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  background: var(--z-soft);
}
.item-grid--collection .item-card__media {
  aspect-ratio: 4 / 5;
}
.item-card__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 18%;
  transition:
    opacity 0.5s ease,
    transform 0.8s ease;
}
.item-card__image--hover {
  opacity: 0;
}
@media (hover: hover) {
  .item-card__link:hover .item-card__image {
    transform: scale(1.03);
  }
  .item-card__link:hover .item-card__image--hover {
    opacity: 1;
  }
}
.item-card__name {
  margin-top: 14px;
  font-family: var(--z-sans);
  font-size: 12.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  line-height: 1.45;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.item-grid--collection .item-card__name {
  margin-top: 16px;
  font-family: var(--z-serif);
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.15;
}
.item-card__price {
  margin-top: 4px;
  font-size: 13.5px;
  color: var(--z-muted);
}
.item-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  padding: 4px 9px;
  background: var(--z-bg);
  font-size: 10.5px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--z-ink);
}
.item-card__favourite {
  position: absolute;
  top: 10px;
  right: 10px;
}
.item-grid__empty {
  padding: 40px 0;
  color: var(--z-muted);
  text-align: center;
}
.item-grid__more {
  display: grid;
  justify-items: center;
  gap: 18px;
  margin-top: 56px;
}
</style>
