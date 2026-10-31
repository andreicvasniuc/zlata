<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { slidersApi, slidesApi } from '@shared/api/resources/sliders'
import type { Slide } from '@shared/types'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import SlideEditor from '../components/SlideEditor.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useEmbeddedList } from '../composables/useEmbeddedList'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'

const columns: GridColumn[] = [
  { field: 'image', header: 'IMAGE', kind: 'image', width: '120px' },
  { field: 'title', header: 'TITLE', sortable: true },
  { field: 'link_text', header: 'LINK_TEXT', sortable: true },
  { field: 'link_url', header: 'LINK_URL', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
]

const route = useRoute()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const sliderSlug = computed(() => String(route.params.sliderId))
const state = useListState({
  basePath: () => `/slider/${encodeURIComponent(sliderSlug.value)}/slides`,
  sortFields: ['title', 'link_text', 'link_url', 'published', 'updated_at'],
})
const list = useEmbeddedList<Slide>(
  async () => {
    const slider = await slidersApi.get(sliderSlug.value)
    return { parentName: slider.name, items: slider.slides ?? [] }
  },
  state,
  'title',
)

onMounted(() => run(list.reload))
watch(sliderSlug, () => run(list.reload))

const editorOpen = ref(false)
const editing = ref<Slide>()
const startTab = ref<'basic' | 'images'>('basic')

async function open(row: Slide | undefined, tab: 'basic' | 'images') {
  const slide = row ? await run(() => slidesApi.get(sliderSlug.value, row.slug)) : undefined
  if (row && !slide) return
  editing.value = slide
  startTab.value = tab
  editorOpen.value = true
}

const remove = (row: Slide) =>
  confirm('DELETE_SLIDE_MESSAGE', async () => {
    if (await run(() => slidesApi.remove(sliderSlug.value, row.slug))) {
      notify.deleted('SLIDE')
      await run(list.reload)
    }
  })

async function togglePublished(row: Slide, published: boolean) {
  const saved = await run(() =>
    slidesApi.update(sliderSlug.value, row.slug, {
      title: row.title,
      link_text: row.link_text,
      link_url: row.link_url,
      published,
    }),
  )
  if (!saved) return
  row.published = published
  notify.published('SLIDE', published)
}
</script>

<template>
  <PageHeading title="SLIDES" parent-kind="SLIDER" :parent-name="list.parentName.value" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    search-placeholder="SEARCH_BY_NAME"
    add-label="ADD_SLIDE"
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
      @sort="state.sort"
      @edit="open($event, 'basic')"
      @upload="open($event, 'images')"
      @delete="remove"
    />
  </ListPanel>
  <SlideEditor
    v-model:visible="editorOpen"
    :slider-slug="sliderSlug"
    :slide="editing"
    :start-tab="startTab"
    @closed="run(list.reload)"
  />
</template>
