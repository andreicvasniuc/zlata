<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/collections'
import { productsApi } from '@shared/api/resources/products'
import type { Product } from '@shared/types'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import ProductEditor from '../components/ProductEditor.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useEmbeddedList } from '../composables/useEmbeddedList'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'

const columns: GridColumn[] = [
  { field: 'cover_image', header: 'COVER', kind: 'image', width: '120px' },
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'description', header: 'DESCRIPTION', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
]

const route = useRoute()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const collectionSlug = computed(() => String(route.params.collectionId))
const state = useListState({
  basePath: () => `/collection/${encodeURIComponent(collectionSlug.value)}/products`,
  sortFields: ['name', 'description', 'published', 'updated_at'],
})
const list = useEmbeddedList<Product>(
  async () => {
    const collection = await collectionsApi.get(collectionSlug.value)
    return { parentName: collection.name, items: collection.products ?? [] }
  },
  state,
  'name',
)

onMounted(() => run(list.reload))
watch(collectionSlug, () => run(list.reload))

const editorOpen = ref(false)
const editing = ref<Product>()
const startTab = ref<'basic' | 'images'>('basic')

async function open(row: Product | undefined, tab: 'basic' | 'images') {
  const product = row ? await run(() => productsApi.get(collectionSlug.value, row.slug)) : undefined
  if (row && !product) return
  editing.value = product
  startTab.value = tab
  editorOpen.value = true
}

const remove = (row: Product) =>
  confirm('DELETE_PRODUCT_MESSAGE', async () => {
    if (await run(() => productsApi.remove(collectionSlug.value, row.slug))) {
      notify.deleted('PRODUCT')
      await run(list.reload)
    }
  })

async function togglePublished(row: Product, published: boolean) {
  const saved = await run(() =>
    productsApi.update(collectionSlug.value, row.slug, {
      name: row.name,
      description: row.description ?? undefined,
      is_top: row.is_top,
      size_ids: row.size_ids,
      color_ids: row.color_ids,
      published,
    }),
  )
  if (!saved) return
  row.published = published
  notify.published('PRODUCT', published)
}
</script>

<template>
  <PageHeading title="PRODUCTS" parent-kind="COLLECTION" :parent-name="list.parentName.value" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    search-placeholder="SEARCH_BY_NAME"
    add-label="ADD_PRODUCT"
    @search="state.search"
    @clear="state.clearSearch"
    @add="open(undefined, 'basic')"
  >
    <EntityGrid
      :columns="columns"
      :rows="list.rows.value"
      :total-count="list.totalCount.value"
      :sort-by="state.sortBy.value"
      :sort-direction="state.sortDirection.value"
      :loading="list.loading.value"
      :toggle-published="togglePublished"
      published
      upload
      @sort="state.sort"
      @edit="open($event, 'basic')"
      @upload="open($event, 'images')"
      @delete="remove"
    />
  </ListPanel>
  <ProductEditor
    v-model:visible="editorOpen"
    :collection-slug="collectionSlug"
    :product="editing"
    :start-tab="startTab"
    @closed="run(list.reload)"
  />
</template>
