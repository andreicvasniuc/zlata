<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { contactGroupsApi, contactsApi } from '@shared/api/resources/contactGroups'
import type { Contact } from '@shared/types'
import ContactEditor from '../components/ContactEditor.vue'
import EntityGrid, { type GridColumn } from '../components/EntityGrid.vue'
import ListPanel from '../components/ListPanel.vue'
import PageHeading from '../components/PageHeading.vue'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useEmbeddedList } from '../composables/useEmbeddedList'
import { useListState } from '../composables/useListState'
import { useNotify } from '../composables/useNotify'

const columns: GridColumn[] = [
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true, width: '200px' },
]

const route = useRoute()
const notify = useNotify()
const confirm = useConfirm()
const { run } = useBusy()

const groupSlug = computed(() => String(route.params.contactGroupId))
const state = useListState({
  basePath: () => `/contact-group/${encodeURIComponent(groupSlug.value)}/contacts`,
  sortFields: ['name', 'description', 'published', 'updated_at'],
})
const list = useEmbeddedList<Contact>(
  async () => {
    const group = await contactGroupsApi.get(groupSlug.value)
    return { parentName: group.name, items: group.contacts ?? [] }
  },
  state,
  'name',
)

onMounted(() => run(list.reload))
watch(groupSlug, () => run(list.reload))

const editorOpen = ref(false)
const editing = ref<Contact>()

async function open(row?: Contact) {
  const contact = row ? await run(() => contactsApi.get(groupSlug.value, row.slug)) : undefined
  if (row && !contact) return
  editing.value = contact
  editorOpen.value = true
}

const remove = (row: Contact) =>
  confirm('DELETE_CONTACT_MESSAGE', async () => {
    if (await run(() => contactsApi.remove(groupSlug.value, row.slug))) {
      notify.deleted('CONTACT')
      await run(list.reload)
    }
  })

async function togglePublished(row: Contact, published: boolean) {
  const saved = await run(() => contactsApi.update(groupSlug.value, row.slug, { name: row.name, published }))
  if (!saved) return
  row.published = published
  notify.published('CONTACT', published)
}
</script>

<template>
  <PageHeading title="CONTACTS" parent-kind="CONTACT_GROUP" :parent-name="list.parentName.value" />
  <ListPanel
    v-model:search-input="state.searchInput.value"
    search-placeholder="SEARCH_BY_NAME"
    add-label="ADD_CONTACT"
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
      @sort="state.sort"
      @edit="open"
      @delete="remove"
    />
  </ListPanel>
  <ContactEditor
    v-model:visible="editorOpen"
    :contact-group-slug="groupSlug"
    :contact="editing"
    @closed="run(list.reload)"
  />
</template>
