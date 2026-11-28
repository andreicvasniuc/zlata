<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { contactGroupsApi } from '@shared/api/resources/contactGroups'
import type { ContactGroup } from '@shared/types'
import ContactGroupEditor from '../components/ContactGroupEditor.vue'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'
import { useServerList } from '../composables/useServerList'

const columns: GridColumn[] = [
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
  { field: 'contacts_count', header: 'CONTACTS_COUNT', kind: 'count', linkTitle: 'GO_TO_CONTACTS', width: '180px' },
]

const router = useRouter()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const state = useListState({
  basePath: () => '/contact-groups',
  sortFields: ['name', 'published', 'updated_at'],
})
const list = useServerList<ContactGroup>(async (request) => {
  const { contactGroups, totalCount } = await contactGroupsApi.search(request)
  return { items: contactGroups, totalCount }
}, state)

const editorOpen = ref(false)
const editing = ref<ContactGroup>()

async function open(row?: ContactGroup) {
  const group = row ? await run(() => contactGroupsApi.get(row.slug)) : undefined
  if (row && !group) return
  editing.value = group
  editorOpen.value = true
}

const remove = (row: ContactGroup) =>
  confirm('DELETE_CONTACT_GROUP_MESSAGE', async () => {
    if (await run(() => contactGroupsApi.remove(row.slug))) {
      notify.deleted('CONTACT_GROUP')
      await list.reload()
    }
  })

async function togglePublished(row: ContactGroup, published: boolean) {
  const saved = await run(() =>
    contactGroupsApi.update(row.slug, { name: row.name, css_class: row.css_class, published }),
  )
  if (!saved) return
  row.published = published
  notify.published('CONTACT_GROUP', published)
}
</script>

<template>
  <PageHeading title="CONTACT_GROUPS" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    add-label="ADD_CONTACT_GROUP"
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
      @open="router.push(`/contact-group/${$event.slug}/contacts`)"
      @load-more="list.loadMore"
    />
  </ListPanel>
  <ContactGroupEditor v-model:visible="editorOpen" :contact-group="editing" @closed="list.reload" />
</template>
