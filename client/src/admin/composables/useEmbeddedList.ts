import { computed, ref } from 'vue'
import type { ListState } from './useListState'

type Sortable = string | number | boolean | null | undefined

const compare = (a: Sortable, b: Sortable): number => {
  if (a === b) return 0
  if (a === undefined || a === null) return 1
  if (b === undefined || b === null) return -1
  if (typeof a === 'string' && typeof b === 'string') return a.toLowerCase().localeCompare(b.toLowerCase())
  return a < b ? -1 : 1
}

interface Loaded<T> {
  parentName: string
  items: T[]
}

// A list embedded in its parent (products of a collection, contacts of a group, slides of a slider):
// the parent is loaded whole, searching and sorting happen in the browser.
export function useEmbeddedList<T extends object>(
  loadParent: () => Promise<Loaded<T>>,
  state: ListState,
  searchField: keyof T & string,
) {
  const parentName = ref('')
  const all = ref<T[]>([]) as { value: T[] }
  const loading = ref(false)

  async function reload() {
    loading.value = true
    try {
      const loaded = await loadParent()
      all.value = loaded.items
      parentName.value = loaded.parentName
    } finally {
      loading.value = false
    }
  }

  const rows = computed(() => {
    const text = state.searchText.value.toLowerCase()
    const field = state.sortBy.value as keyof T
    const filtered = text
      ? all.value.filter((item) =>
          String(item[searchField] ?? '')
            .toLowerCase()
            .includes(text),
        )
      : all.value.slice()
    const sorted = filtered.sort((a, b) => compare(a[field] as Sortable, b[field] as Sortable))
    return state.sortDirection.value === 'desc' ? sorted.reverse() : sorted
  })

  return { parentName, rows, totalCount: computed(() => rows.value.length), loading, reload }
}
