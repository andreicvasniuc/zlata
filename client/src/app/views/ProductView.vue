<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { collectionsApi, colorsApi, sizesApi } from '@shared/api/resources/public'
import type { Collection } from '@shared/types'
import ItemGrid from '../components/ItemGrid.vue'
import NotFoundContent from '../components/NotFoundContent.vue'
import PageLayout from '../components/PageLayout.vue'
import ProductDetails, { type ProductWithExtras } from '../components/ProductDetails.vue'
import ProductNavigation from '../components/ProductNavigation.vue'
import { NotFoundError, useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { usePriceLabel } from '../composables/usePriceLabel'
import { useLocalePath } from '../locale'
import { coverFirst, productGridItem } from '../product'
import { vReveal } from '../reveal'
import { plainText } from '../text'

const RELATED = 4

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const priceLabel = usePriceLabel()

interface Loaded {
  collection: Collection
  product: ProductWithExtras
  index: number
}

const { data, loading, notFound, failed } = useLoader<Loaded>(async () => {
  const [{ collection }, { colors }, { sizes }] = await Promise.all([
    collectionsApi.get(String(route.params.collection)),
    colorsApi.list(),
    sizesApi.list(),
  ])
  // only published products take part in the site, including the previous / next navigation
  const products = (collection?.products ?? []).filter((item) => item.published)
  const index = products.findIndex((item) => item.slug === route.params.product)
  const found = products[index]
  if (!collection?.published || !found) throw new NotFoundError('product not found')

  const product: ProductWithExtras = {
    ...found,
    description: plainText(found.description),
    images: coverFirst(found.images),
    colors: (colors ?? []).filter((color) => found.color_ids?.includes(color.id)),
    sizes: (sizes ?? []).filter((size) => found.size_ids?.includes(size.id)),
  }
  return { collection: { ...collection, products }, product, index }
})

const missing = computed(() => notFound.value || failed.value)
const title = computed(() => (missing.value ? t('NOT_FOUND') : data.value?.product.name))
usePageTitle(title)

const breadcrumb = computed(() => {
  if (!data.value) return undefined
  const { collection, product } = data.value
  const isAccessories = collection.has_accessories
  return [
    {
      name: t(isAccessories ? 'ALL_ACCESSORIES' : 'ALL_COLLECTIONS'),
      url: isAccessories ? '/accessories' : '/collections',
    },
    { name: collection.name, url: `/${collection.slug}` },
    { name: product.name },
  ]
})

// the next products of the collection, starting over at the beginning
const related = computed(() => {
  if (!data.value) return []
  const { collection, index } = data.value
  const products = collection.products ?? []
  const count = Math.min(RELATED, products.length - 1)
  return Array.from({ length: count }, (_, offset) => products[(index + 1 + offset) % products.length]!).map(
    (product) => productGridItem(product, collection.slug, priceLabel(product)),
  )
})
</script>

<template>
  <PageLayout :heading="title" :breadcrumb="breadcrumb" :loading="loading" :compact-heading="!missing">
    <div v-if="missing" class="wrap listing">
      <NotFoundContent />
    </div>
    <template v-else-if="data">
      <ProductDetails
        :product="data.product"
        :collection-name="data.collection.name"
        :collection-slug="data.collection.slug"
      />
      <ProductNavigation
        v-if="data.collection.products!.length > 1"
        :collection="data.collection"
        :index="data.index"
      />

      <section v-if="related.length" v-reveal class="section related-products" aria-labelledby="related-title">
        <div class="wrap">
          <div class="section-head">
            <div>
              <p class="eyebrow">{{ t('YOU_MAY_ALSO_LIKE') }}</p>
              <h2 id="related-title">{{ t('MORE_FROM', { name: data.collection.name }) }}</h2>
            </div>
            <RouterLink :to="localePath(`/${data.collection.slug}`)" class="text-link">
              {{ t('VIEW_COLLECTION') }}
            </RouterLink>
          </div>
          <ItemGrid :items="related" />
        </div>
      </section>
    </template>
  </PageLayout>
</template>
