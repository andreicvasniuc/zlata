<script setup lang="ts" generic="T extends object">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DataTable, { type DataTableRowClickEvent, type DataTableSortEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import type { ImageFile, SortDirection } from '@shared/types'
import IconEdit from '~icons/lucide/pencil'
import IconUpload from '~icons/lucide/upload'
import IconDelete from '~icons/lucide/trash'
import IconSpinner from '~icons/lucide/loader-circle'
import PublishedToggle from './PublishedToggle.vue'

export interface GridColumn {
  field: string
  // i18n key of the header
  header: string
  sortable?: boolean
  width?: string
  // `image`: thumbnail (click opens the image tab), `count`: link to the child list, default: plain text
  kind?: 'text' | 'date' | 'image' | 'count' | 'boolean'
  // i18n key of the title of the `count` link
  linkTitle?: string
}

const props = defineProps<{
  columns: GridColumn[]
  rows: T[]
  totalCount: number
  sortBy: string
  sortDirection: SortDirection
  loading?: boolean
  // show the published toggle column / the upload action
  published?: boolean
  upload?: boolean
  // rows load page by page while scrolling
  infinite?: boolean
  togglePublished?: (row: T, published: boolean) => Promise<void>
}>()

const emit = defineEmits<{
  sort: [field: string, direction: SortDirection]
  edit: [row: T]
  upload: [row: T]
  delete: [row: T]
  open: [row: T]
  loadMore: []
}>()

const { t } = useI18n()
const scroller = ref<HTMLElement>()

const value = (row: T, field: string) => (row as Record<string, unknown>)[field]
const image = (row: T, field: string) => value(row, field) as ImageFile | undefined

// dd/MM/yyyy, as in the old grids
function formatDate(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

// 1 item, 2-4 items (own form in ua/ru), other
const countLabel = (count: number) => (count === 1 ? 'ITEM' : count >= 2 && count <= 4 ? 'ITEM_2_3_4' : 'ITEMS')

function onSort(event: DataTableSortEvent) {
  if (typeof event.sortField === 'string') emit('sort', event.sortField, event.sortOrder === 1 ? 'asc' : 'desc')
}

// the toggle, image, count link and actions are not part of the "click a row to edit it" area
function onRowClick(event: DataTableRowClickEvent) {
  const target = event.originalEvent.target as HTMLElement | null
  if (target?.closest('[data-static]')) return
  emit('edit', event.data as T)
}

function needsMore(): boolean {
  const element = scroller.value
  if (!props.infinite || !element || props.rows.length >= props.totalCount) return false
  return element.scrollTop + element.clientHeight >= element.scrollHeight - 340
}

function onScroll() {
  if (needsMore()) emit('loadMore')
}

// a short first page may not fill the grid, so there would be nothing to scroll: keep loading until it does
watch(
  () => props.rows.length,
  async () => {
    await nextTick()
    if (scroller.value && scroller.value.clientHeight > 0 && needsMore()) emit('loadMore')
  },
)
</script>

<template>
  <div>
    <div class="mb-1 min-h-6 text-sm" data-testid="grid-count">
      <template v-if="totalCount">{{ totalCount }} {{ t(countLabel(totalCount)) }}</template>
    </div>
    <div
      ref="scroller"
      class="relative max-h-[70vh] min-h-[200px] overflow-y-auto border border-border"
      data-testid="grid"
      @scroll="onScroll"
    >
      <DataTable
        :value="rows"
        lazy
        row-hover
        :sort-field="sortBy"
        :sort-order="sortDirection === 'asc' ? 1 : -1"
        :pt="{ bodyRow: { class: 'cursor-pointer' } }"
        @sort="onSort"
        @row-click="onRowClick"
      >
        <Column
          v-for="column in columns"
          :key="column.field"
          :field="column.field"
          :header="t(column.header)"
          :sortable="column.sortable"
          :style="column.width ? { width: column.width } : undefined"
          :pt="column.kind === 'image' || column.kind === 'count' ? { bodyCell: { 'data-static': '' } } : undefined"
        >
          <template #body="{ data }">
            <template v-if="column.kind === 'image'">
              <button
                v-if="image(data, column.field)"
                type="button"
                class="cursor-pointer"
                @click="emit('upload', data)"
              >
                <img
                  :src="image(data, column.field)?.url"
                  alt=""
                  class="max-h-40 max-w-28 border border-border p-0.5"
                />
              </button>
            </template>
            <template v-else-if="column.kind === 'count'">
              <button
                type="button"
                class="w-full cursor-pointer text-center text-accent hover:underline"
                :title="column.linkTitle ? t(column.linkTitle) : undefined"
                @click="emit('open', data)"
              >
                {{ value(data, column.field) ?? 0 }}
              </button>
            </template>
            <template v-else-if="column.kind === 'date'">{{ formatDate(value(data, column.field)) }}</template>
            <template v-else-if="column.kind === 'boolean'">{{ value(data, column.field) ? '✓' : '' }}</template>
            <template v-else>{{ value(data, column.field) }}</template>
          </template>
        </Column>

        <Column
          v-if="published && togglePublished"
          field="published"
          header=""
          sortable
          style="width: 4.5rem"
          :pt="{ bodyCell: { 'data-static': '' } }"
        >
          <template #body="{ data }">
            <PublishedToggle
              :published="!!value(data, 'published')"
              :toggle="(next: boolean) => togglePublished!(data, next)"
            />
          </template>
        </Column>

        <Column header="" style="width: 7rem" :pt="{ bodyCell: { 'data-static': '' } }">
          <template #body="{ data }">
            <div class="flex items-center gap-3">
              <button
                type="button"
                :title="t('EDIT')"
                :aria-label="t('EDIT')"
                data-testid="edit"
                @click="emit('edit', data)"
              >
                <IconEdit class="size-4 text-ink-soft hover:text-accent" />
              </button>
              <button
                v-if="upload"
                type="button"
                :title="t('UPLOAD')"
                :aria-label="t('UPLOAD')"
                data-testid="upload"
                @click="emit('upload', data)"
              >
                <IconUpload class="size-4 text-ink-soft hover:text-accent" />
              </button>
              <button
                type="button"
                :title="t('DELETE')"
                :aria-label="t('DELETE')"
                data-testid="delete"
                @click="emit('delete', data)"
              >
                <IconDelete class="size-4 text-ink-soft hover:text-danger" />
              </button>
            </div>
          </template>
        </Column>

        <template #empty>
          <div v-if="!loading" class="py-8 text-center text-ink-soft" data-testid="empty">
            {{ t('NO_RECORDS_FOUND') }}
          </div>
        </template>
      </DataTable>
      <div
        v-if="loading"
        class="absolute inset-x-0 bottom-0 flex justify-center bg-white/70 py-2"
        data-testid="loading"
      >
        <IconSpinner class="size-5 animate-spin text-ink-soft" />
      </div>
    </div>
  </div>
</template>
