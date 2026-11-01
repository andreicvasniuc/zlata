<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'
import CatalogImage from './CatalogImage.vue'

export interface GridItem {
  id: string
  name: string
  // path without the locale prefix
  url: string
  image?: string
  // e.g. "from 1 200 €"; shown under the name only when set
  price?: string
}

// `fit`: products keep their whole photograph in the frame, collection covers fill it.
withDefaults(defineProps<{ items: GridItem[]; fit?: 'cover' | 'contain'; wide?: boolean }>(), { fit: 'contain' })

const { t } = useI18n()
const localePath = useLocalePath()

// the first row loads right away, the rest when scrolled near
const EAGER_COUNT = 4
</script>

<template>
  <p v-if="items.length === 0" class="item-grid-empty">{{ t('NO_RECORDS_FOUND') }}</p>

  <ul v-else class="item-grid" :class="{ wide }">
    <li v-for="(item, index) in items" :key="item.id" class="item-card">
      <RouterLink :to="localePath(item.url)" class="item-card-link">
        <div class="item-card-photo">
          <CatalogImage :src="item.image" :alt="item.name" :fit="fit" :eager="index < EAGER_COUNT" />
        </div>
        <div class="item-card-body">
          <h3 class="item-card-name">{{ item.name }}</h3>
          <p v-if="item.price" class="price">{{ item.price }}</p>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<style>
.item-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px 12px;
}
.item-card-link {
  display: block;
}
.item-card-photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-sand);
}
.item-card-body {
  padding-top: 12px;
}
.item-card-name {
  margin: 0;
  font-size: 1.35rem;
  line-height: 1.2;
}
.item-card .price {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.item-card-link:hover .item-card-name {
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
}
.item-grid-empty {
  padding: 48px 0;
  text-align: center;
  color: var(--color-ink-soft);
}

@media (min-width: 768px) {
  .item-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 40px 24px;
  }
}
@media (min-width: 1100px) {
  .item-grid.wide {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
