<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { slidersApi } from '@shared/api/resources/sliders'
import type { Slider } from '@shared/types'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import SliderEditor from '../components/SliderEditor.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'
import { useServerList } from '../composables/useServerList'

const columns: GridColumn[] = [
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'autoplay', header: 'AUTOPLAY', kind: 'boolean', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
  { field: 'slides_count', header: 'SLIDES_COUNT', kind: 'count', linkTitle: 'GO_TO_SLIDES', width: '180px' },
]

const router = useRouter()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const state = useListState({
  basePath: () => '/sliders',
  sortFields: ['name', 'autoplay', 'published', 'updated_at'],
})
const list = useServerList<Slider>(async (request) => {
  const { sliders, totalCount } = await slidersApi.search(request)
  return { items: sliders, totalCount }
}, state)

const editorOpen = ref(false)
const editing = ref<Slider>()

async function open(row?: Slider) {
  const slider = row ? await run(() => slidersApi.get(row.slug)) : undefined
  if (row && !slider) return
  editing.value = slider
  editorOpen.value = true
}

const remove = (row: Slider) =>
  confirm('DELETE_SLIDER_MESSAGE', async () => {
    if (await run(() => slidersApi.remove(row.slug))) {
      notify.deleted('SLIDER')
      await list.reload()
    }
  })

async function togglePublished(row: Slider, published: boolean) {
  const saved = await run(() => slidersApi.update(row.slug, { name: row.name, autoplay: row.autoplay, published }))
  if (!saved) return
  row.published = published
  notify.published('SLIDER', published)
}
</script>

<template>
  <PageHeading title="SLIDERS" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    add-label="ADD_SLIDER"
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
      @open="router.push(`/slider/${$event.slug}/slides`)"
      @load-more="list.loadMore"
    />
  </ListPanel>
  <SliderEditor v-model:visible="editorOpen" :slider="editing" @closed="list.reload" />
</template>
