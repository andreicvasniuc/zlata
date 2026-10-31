<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/public'
import ItemGrid, { type GridItem } from '../components/ItemGrid.vue'
import NotFoundContent from '../components/NotFoundContent.vue'
import PageLayout from '../components/PageLayout.vue'
import { useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'

// one view for /collections (dresses) and /accessories
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const isAccessories = route.meta.page === 'accessories'
const title = computed(() => t(isAccessories ? 'ALL_ACCESSORIES' : 'ALL_COLLECTIONS'))
usePageTitle(title)

const { data, loading, failed } = useLoader(async () => {
  const response = await (isAccessories ? collectionsApi.accessories() : collectionsApi.dresses())
  const collections = response.collections ?? []
  // a single collection is shown directly, as before
  if (collections.length === 1 && collections[0]) await router.replace(localePath(`/${collections[0].slug}`))
  return collections
})

const items = computed<GridItem[]>(() =>
  (data.value ?? []).map((collection) => ({
    id: collection.id,
    name: collection.name,
    url: `/${collection.slug}`,
    image: collection.image?.url,
  })),
)
</script>

<template>
  <PageLayout :heading="title" :breadcrumb="[{ name: title }]" :loading="loading" centered>
    <NotFoundContent v-if="failed" />
    <ItemGrid v-else :items="items" />
  </PageLayout>
</template>
