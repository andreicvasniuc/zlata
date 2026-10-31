<script setup lang="ts">
import { collectionsApi } from '@shared/api/resources/collections'
import ParentSelector from '../components/ParentSelector.vue'

const load = async () => (await collectionsApi.list()).collections
</script>

<template>
  <ParentSelector
    title="PRODUCTS"
    parent-label="COLLECTION_"
    add-parent-label="GO_AND_ADD_COLLECTIONS"
    parent-list-path="/collections"
    :load="load"
    :child-path="(slug) => `/collection/${encodeURIComponent(slug)}/products`"
  />
</template>
