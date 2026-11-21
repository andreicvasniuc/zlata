<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/public'
import type { Product } from '@shared/types'
import ItemGrid from '../components/ItemGrid.vue'
import NotFoundContent from '../components/NotFoundContent.vue'
import PageLayout from '../components/PageLayout.vue'
import { NotFoundError, useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { usePriceLabel } from '../composables/usePriceLabel'
import { productGridItem } from '../product'
import { plainText } from '../text'

const PAGE_SIZE = 12

const { t, locale } = useI18n()
const route = useRoute()
const priceLabel = usePriceLabel()

const { data, loading, notFound, failed } = useLoader(async () => {
  const { collection } = await collectionsApi.get(String(route.params.collection))
  // unpublished collections are not part of the site
  if (!collection?.published) throw new NotFoundError('not published')
  return collection
})

const collection = computed(() => data.value)
const missing = computed(() => notFound.value || failed.value || (!loading.value && !collection.value))

const title = computed(() => (missing.value ? t('NOT_FOUND') : collection.value?.name))
usePageTitle(title)

const intro = computed(() => (missing.value ? undefined : plainText(collection.value?.description)))

type SortKey = 'featured' | 'newest' | 'name' | 'price_asc' | 'price_desc'
const SORTS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'SORT_FEATURED' },
  { key: 'newest', label: 'SORT_NEWEST' },
  { key: 'name', label: 'SORT_NAME' },
  { key: 'price_asc', label: 'SORT_PRICE_ASC' },
  { key: 'price_desc', label: 'SORT_PRICE_DESC' },
]
const sort = ref<SortKey>('featured')

// products without a price go last whichever way the prices are sorted
const comparators: Record<SortKey, ((a: Product, b: Product) => number) | undefined> = {
  featured: undefined,
  newest: (a, b) => Date.parse(b.created_at ?? '') - Date.parse(a.created_at ?? '') || 0,
  name: (a, b) => a.name.localeCompare(b.name, locale.value),
  price_asc: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) || 0,
  price_desc: (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity) || 0,
}

const products = computed(() => {
  const published = (collection.value?.products ?? []).filter((product) => product.published)
  const compare = comparators[sort.value]
  return compare ? [...published].sort(compare) : published
})

const items = computed(() =>
  products.value.map((product) => productGridItem(product, collection.value?.slug, priceLabel(product))),
)

const breadcrumb = computed(() => {
  if (!collection.value) return undefined
  const isAccessories = collection.value.has_accessories
  return [
    {
      name: t(isAccessories ? 'ALL_ACCESSORIES' : 'ALL_COLLECTIONS'),
      url: isAccessories ? '/accessories' : '/collections',
    },
    { name: collection.value.name },
  ]
})
</script>

<template>
  <PageLayout :heading="title" :intro="intro" :breadcrumb="breadcrumb" :loading="loading">
    <div class="wrap listing">
      <NotFoundContent v-if="missing" />
      <template v-else>
        <div v-if="items.length > 1" class="listing-bar">
          <p class="listing-bar__count">{{ t('ITEMS_COUNT', { n: items.length }) }}</p>
          <label class="listing-bar__sort">
            <span>{{ t('SORT_BY') }}</span>
            <select v-model="sort" class="listing-bar__select">
              <option v-for="option in SORTS" :key="option.key" :value="option.key">{{ t(option.label) }}</option>
            </select>
          </label>
        </div>
        <!-- another order starts again with the first page -->
        <ItemGrid :key="sort" :items="items" :page-size="PAGE_SIZE" />
      </template>
    </div>
  </PageLayout>
</template>

<style>
.listing-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--z-line);
}
.listing-bar__count {
  font-size: 13px;
  color: var(--z-muted);
}
.listing-bar__sort {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.listing-bar__select {
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--z-line);
  background: var(--z-surface);
  font-size: 13px;
  letter-spacing: normal;
  text-transform: none;
  cursor: pointer;
}
@media (max-width: 479px) {
  .listing-bar__sort > span {
    display: none;
  }
}
</style>
