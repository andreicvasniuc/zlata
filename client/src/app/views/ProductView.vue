<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { collectionsApi, colorsApi, sizesApi } from '@shared/api/resources/public'
import type { Collection } from '@shared/types'
import NotFoundContent from '../components/NotFoundContent.vue'
import PageLayout from '../components/PageLayout.vue'
import ProductDetails, { type ProductWithExtras } from '../components/ProductDetails.vue'
import ProductNavigation from '../components/ProductNavigation.vue'
import { NotFoundError, useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { coverFirst } from '../product'

const { t } = useI18n()
const route = useRoute()

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
</script>

<template>
  <PageLayout :heading="title" :breadcrumb="breadcrumb" :loading="loading">
    <NotFoundContent v-if="missing" />
    <ProductDetails v-else-if="data" :product="data.product">
      <ProductNavigation
        v-if="data.collection.products!.length > 1"
        :collection="data.collection"
        :index="data.index"
      />
    </ProductDetails>
  </PageLayout>
</template>
