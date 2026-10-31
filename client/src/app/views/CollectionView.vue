<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/public'
import ItemGrid, { type GridItem } from '../components/ItemGrid.vue'
import NotFoundContent from '../components/NotFoundContent.vue'
import PageLayout from '../components/PageLayout.vue'
import { NotFoundError, useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { usePriceLabel } from '../composables/usePriceLabel'

const { t } = useI18n()
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

const items = computed<GridItem[]>(() =>
  (collection.value?.products ?? [])
    .filter((product) => product.published)
    .map((product) => ({
      id: product.id,
      name: product.name,
      url: `/${collection.value?.slug}/${product.slug}`,
      image: product.cover_image?.url,
      price: priceLabel(product),
    })),
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
  <PageLayout :heading="title" :breadcrumb="breadcrumb" :loading="loading" centered>
    <NotFoundContent v-if="missing" />
    <ItemGrid v-else :items="items" />
  </PageLayout>
</template>
