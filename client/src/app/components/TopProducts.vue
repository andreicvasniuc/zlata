<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { productsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import ItemGrid, { type GridItem } from './ItemGrid.vue'
import LoadingIcon from './LoadingIcon.vue'

const { t } = useI18n()
const { data, loading } = useLoader(async () => (await productsApi.topList()).products ?? [])

const items = computed<GridItem[]>(() =>
  (data.value ?? []).map((product) => ({
    id: product.id,
    name: product.name,
    url: `/${product.collection_slug}/${product.slug}`,
    image: product.cover_image?.url,
  })),
)
</script>

<template>
  <LoadingIcon v-show="loading" />

  <div v-show="!loading" class="col-md-10 col-md-offset-1 clearfix fh5co-header">
    <h1 class="fh5co-heading mb-0!">{{ t('TOP_DRESSES') }}</h1>
    <div class="fh5co-spacer fh5co-spacer-sm"></div>

    <ItemGrid :items="items" />
  </div>
</template>
