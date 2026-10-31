<script setup lang="ts">
import { ref } from 'vue'
import { socialNetworkingsApi } from '@shared/api/resources/socialNetworkings'
import type { SocialNetworking } from '@shared/types'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import SocialNetworkingEditor from '../components/SocialNetworkingEditor.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'
import { useServerList } from '../composables/useServerList'

const columns: GridColumn[] = [
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'url', header: 'URL', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
]

const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const state = useListState({
  basePath: () => '/social-networkings',
  sortFields: ['name', 'url', 'published', 'updated_at'],
})
const list = useServerList<SocialNetworking>(async (request) => {
  const { socialNetworkings, totalCount } = await socialNetworkingsApi.search(request)
  return { items: socialNetworkings, totalCount }
}, state)

const editorOpen = ref(false)
const editing = ref<SocialNetworking>()

async function open(row?: SocialNetworking) {
  const item = row ? await run(() => socialNetworkingsApi.get(row.slug)) : undefined
  if (row && !item) return
  editing.value = item
  editorOpen.value = true
}

const remove = (row: SocialNetworking) =>
  confirm('DELETE_SOCIAL_NETWORKING_MESSAGE', async () => {
    if (await run(() => socialNetworkingsApi.remove(row.slug))) {
      notify.deleted('SOCIAL_NETWORKING')
      await list.reload()
    }
  })

async function togglePublished(row: SocialNetworking, published: boolean) {
  const saved = await run(() =>
    socialNetworkingsApi.update(row.slug, { name: row.name, url: row.url, css_class: row.css_class, published }),
  )
  if (!saved) return
  row.published = published
  notify.published('SOCIAL_NETWORKING', published)
}
</script>

<template>
  <PageHeading title="SOCIAL_NETWORKINGS" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    add-label="ADD_SOCIAL_NETWORKING"
    @search="state.search"
    @clear="state.clearSearch"
    @add="open()"
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
      infinite
      @sort="state.sort"
      @edit="open"
      @delete="remove"
      @load-more="list.loadMore"
    />
  </ListPanel>
  <SocialNetworkingEditor v-model:visible="editorOpen" :social-networking="editing" @closed="list.reload" />
</template>
