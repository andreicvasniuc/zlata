import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { SortDirection } from '@shared/types'

export const PAGE_SIZE = 10

interface Options {
  // the list's own path without the `/sort/...` part, e.g. `/collections` or `/collection/some-slug/products`
  basePath: () => string
  sortFields: readonly string[]
  defaultSortBy?: string
  defaultDirection?: SortDirection
}

// Sorting and search live in the URL (`<base>/sort/:sortBy/:sortByDirection/search/:searchText?`), like in the old admin.
export function useListState(options: Options) {
  const route = useRoute()
  const router = useRouter()
  const defaultSortBy = options.defaultSortBy ?? 'updated_at'
  const defaultDirection = options.defaultDirection ?? 'desc'

  const param = (name: string) => {
    const value = route.params[name]
    return typeof value === 'string' ? value : undefined
  }

  const sortBy = computed(() => {
    const value = param('sortBy')?.toLowerCase()
    return value && options.sortFields.includes(value) ? value : defaultSortBy
  })
  const sortDirection = computed<SortDirection>(() => {
    const value = param('sortByDirection')?.toLowerCase()
    return value === 'asc' || value === 'desc' ? value : defaultDirection
  })
  const searchText = computed(() => param('searchText') ?? '')

  // what is typed into the search box (applied on Enter / the search button)
  const searchInput = ref(searchText.value)
  watch(searchText, (value) => (searchInput.value = value))

  const goTo = (by: string, direction: SortDirection, text: string) => {
    const search = text ? `/${encodeURIComponent(text)}` : ''
    return router.push(`${options.basePath()}/sort/${by}/${direction}/search${search}`)
  }

  return {
    sortBy,
    sortDirection,
    searchText,
    searchInput,
    sort: (by: string, direction: SortDirection) => goTo(by, direction, searchText.value),
    search: () => goTo(sortBy.value, sortDirection.value, searchInput.value.trim()),
    clearSearch: () => {
      searchInput.value = ''
      return goTo(sortBy.value, sortDirection.value, '')
    },
  }
}

export type ListState = ReturnType<typeof useListState>
