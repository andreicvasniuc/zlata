<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { collectionsApi } from '@shared/api/resources/collections'
import type { Collection } from '@shared/types'
import CollectionEditor from '../components/CollectionEditor.vue'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'
import { useServerList } from '../composables/useServerList'

const columns: GridColumn[] = [
  { field: 'image', header: 'COVER', kind: 'image', width: '120px' },
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'description', header: 'DESCRIPTION', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
  { field: 'products_count', header: 'PRODUCTS_COUNT', kind: 'count', linkTitle: 'GO_TO_PRODUCTS', width: '180px' },
]

const router = useRouter()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const state = useListState({
  basePath: () => '/collections',
  sortFields: ['name', 'description', 'published', 'updated_at'],
})
const list = useServerList<Collection>(async (request) => {
  const { collections, totalCount } = await collectionsApi.search(request)
  return { items: collections, totalCount }
}, state)

const editorOpen = ref(false)
const editing = ref<Collection>()
const startTab = ref<'basic' | 'images'>('basic')

async function open(row: Collection | undefined, tab: 'basic' | 'images') {
  const collection = row ? await run(() => collectionsApi.get(row.slug)) : undefined
  if (row && !collection) return
  editing.value = collection
  startTab.value = tab
  editorOpen.value = true
}

const remove = (row: Collection) =>
  confirm('DELETE_COLLECTION_MESSAGE', async () => {
    if (await run(() => collectionsApi.remove(row.slug))) {
      notify.deleted('COLLECTION')
      await list.reload()
    }
  })

async function togglePublished(row: Collection, published: boolean) {
  const saved = await run(() =>
    collectionsApi.update(row.slug, { name: row.name, description: row.description ?? undefined, published }),
  )
  if (!saved) return
  row.published = published
  notify.published('COLLECTION', published)
}
</script>

<template>
  <PageHeading title="COLLECTIONS" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    add-label="ADD_COLLECTION"
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
      infinite
      @sort="state.sort"
      @edit="open($event, 'basic')"
      @upload="open($event, 'images')"
      @delete="remove"
      @open="router.push(`/collection/${$event.slug}/products`)"
      @load-more="list.loadMore"
    />
  </ListPanel>
  <CollectionEditor v-model:visible="editorOpen" :collection="editing" :start-tab="startTab" @closed="list.reload" />
</template>
