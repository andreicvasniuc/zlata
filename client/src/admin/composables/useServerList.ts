import { ref, watch } from 'vue'
import type { SearchRequest } from '@shared/types'
import { PAGE_SIZE, type ListState } from './useListState'

interface Page<T> {
  items: T[]
  totalCount: number
}

// A list searched, sorted and paged by the server (10 rows at a time, the next page loads on scroll).
export function useServerList<T>(fetchPage: (request: SearchRequest) => Promise<Page<T>>, state: ListState) {
  const rows = ref<T[]>([]) as { value: T[] }
  const totalCount = ref(0)
  const loading = ref(false)
  let generation = 0
  // the server's total ignores the search text, so a short page (not the total) tells that the end is reached
  let exhausted = false

  const request = (skip: number): SearchRequest => ({
    search: state.searchText.value,
    pagination: { skip, take: PAGE_SIZE },
    sorting: { field: state.sortBy.value, direction: state.sortDirection.value },
  })

  async function load(reset: boolean) {
    const current = reset ? ++generation : generation
    loading.value = true
    try {
      const page = await fetchPage(request(reset ? 0 : rows.value.length))
      if (current !== generation) return // a newer search has started meanwhile
      exhausted = page.items.length < PAGE_SIZE
      rows.value = reset ? page.items : rows.value.concat(page.items)
      totalCount.value = page.totalCount
    } finally {
      if (current === generation) loading.value = false
    }
  }

  const reload = () => load(true)
  const loadMore = async () => {
    if (loading.value || exhausted || rows.value.length >= totalCount.value) return
    await load(false)
  }

  watch([state.sortBy, state.sortDirection, state.searchText], reload, { immediate: true })

  return { rows, totalCount, loading, reload, loadMore }
}
