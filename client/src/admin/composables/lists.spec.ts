import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import type { SearchRequest } from '@shared/types'
import { useEmbeddedList } from './useEmbeddedList'
import { useListState } from './useListState'
import { useServerList } from './useServerList'

const SORT_FIELDS = ['name', 'published', 'updated_at']

// the list routes of the admin: the plain path plus the `/sort/.../search/...` alias
async function setup<T>(build: (state: ReturnType<typeof useListState>) => T, url = '/things') {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/things',
        alias: '/things/sort/:sortBy/:sortByDirection/search/:searchText?',
        component: { render: () => null },
      },
    ],
  })
  let state!: ReturnType<typeof useListState>
  let result!: T
  const Harness = defineComponent({
    setup() {
      state = useListState({ basePath: () => '/things', sortFields: SORT_FIELDS })
      result = build(state)
      return () => h('div')
    },
  })
  await router.push(url)
  const wrapper = mount(Harness, { global: { plugins: [router] } })
  return { router, state, result, wrapper }
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useListState', () => {
  it('defaults to the newest first without a search', async () => {
    const { state } = await setup((s) => s)
    expect(state.sortBy.value).toBe('updated_at')
    expect(state.sortDirection.value).toBe('desc')
    expect(state.searchText.value).toBe('')
  })

  it('reads sorting and search from the URL, decoded', async () => {
    const { state } = await setup((s) => s, '/things/sort/name/asc/search/wedding%20dress')
    expect(state.sortBy.value).toBe('name')
    expect(state.sortDirection.value).toBe('asc')
    expect(state.searchText.value).toBe('wedding dress')
    expect(state.searchInput.value).toBe('wedding dress')
  })

  it('ignores a sort field the list does not know', async () => {
    const { state } = await setup((s) => s, '/things/sort/hacked/asc/search')
    expect(state.sortBy.value).toBe('updated_at')
  })

  it('sorting keeps the search, searching keeps the sorting', async () => {
    const { state, router } = await setup((s) => s, '/things/sort/name/asc/search/queen')

    await state.sort('published', 'desc')
    expect(router.currentRoute.value.fullPath).toBe('/things/sort/published/desc/search/queen')

    state.searchInput.value = '  love is  '
    await state.search()
    expect(router.currentRoute.value.fullPath).toBe('/things/sort/published/desc/search/love%20is')
  })

  it('clearing the search empties the box and the URL', async () => {
    const { state, router } = await setup((s) => s, '/things/sort/name/asc/search/queen')
    await state.clearSearch()
    expect(state.searchInput.value).toBe('')
    expect(router.currentRoute.value.fullPath).toBe('/things/sort/name/asc/search')
  })
})

describe('useServerList', () => {
  const page = (from: number, count: number) => Array.from({ length: count }, (_, i) => ({ id: String(from + i) }))

  it('loads the first page with the sorting and search of the URL', async () => {
    const fetchPage = vi.fn(async () => ({ items: page(0, 10), totalCount: 25 }))
    const { result } = await setup((state) => useServerList(fetchPage, state), '/things/sort/name/asc/search/q')
    await settle()

    expect(fetchPage).toHaveBeenCalledWith({
      search: 'q',
      pagination: { skip: 0, take: 10 },
      sorting: { field: 'name', direction: 'asc' },
    })
    expect(result.rows.value).toHaveLength(10)
    expect(result.totalCount.value).toBe(25)
    expect(result.loading.value).toBe(false)
  })

  it('appends the next pages and stops at the total', async () => {
    const fetchPage = vi.fn(async (request: SearchRequest) => ({
      items: page(request.pagination.skip, Math.min(10, 25 - request.pagination.skip)),
      totalCount: 25,
    }))
    const { result } = await setup((state) => useServerList(fetchPage, state))
    await settle()

    await result.loadMore()
    await result.loadMore()
    expect(result.rows.value).toHaveLength(25)
    expect(fetchPage.mock.calls.map(([request]) => request.pagination.skip)).toEqual([0, 10, 20])

    await result.loadMore()
    expect(fetchPage).toHaveBeenCalledTimes(3)
  })

  it('stops after a short page even if the (unfiltered) total says there is more', async () => {
    const fetchPage = vi.fn(async () => ({ items: page(0, 2), totalCount: 50 }))
    const { result } = await setup((state) => useServerList(fetchPage, state), '/things/sort/name/asc/search/q')
    await settle()

    await result.loadMore()
    expect(fetchPage).toHaveBeenCalledTimes(1)
  })

  it('searches again when the URL changes and ignores a slower, older answer', async () => {
    const resolvers: Record<string, (value: { items: { id: string }[]; totalCount: number }) => void> = {}
    const fetchPage = vi.fn(
      (request: SearchRequest) =>
        new Promise<{ items: { id: string }[]; totalCount: number }>(
          (resolve) => (resolvers[request.search] = resolve),
        ),
    )
    const { result, state } = await setup((s) => useServerList(fetchPage, s))

    state.searchInput.value = 'new'
    await state.search()
    await settle()
    expect(fetchPage).toHaveBeenCalledTimes(2)

    resolvers.new!({ items: [{ id: 'new' }], totalCount: 1 })
    await settle()
    resolvers['']!({ items: [{ id: 'old' }], totalCount: 1 })
    await settle()

    expect(result.rows.value).toEqual([{ id: 'new' }])
  })

  it('reload starts from the first page again', async () => {
    const fetchPage = vi.fn(async (request: SearchRequest) => ({
      items: page(request.pagination.skip, 10),
      totalCount: 30,
    }))
    const { result } = await setup((state) => useServerList(fetchPage, state))
    await settle()
    await result.loadMore()
    expect(result.rows.value).toHaveLength(20)

    await result.reload()
    expect(result.rows.value).toHaveLength(10)
  })
})

describe('useEmbeddedList', () => {
  interface Item {
    name: string
    published?: boolean
    updated_at?: string
  }
  const items: Item[] = [
    { name: 'beta', published: true, updated_at: '2023-02-01' },
    { name: 'Alpha', published: false, updated_at: '2023-03-01' },
    { name: 'gamma', updated_at: '2023-01-01' },
  ]
  const names = (rows: { value: Item[] }) => rows.value.map((item) => item.name)

  async function embedded(url: string) {
    const { result } = await setup(
      (state) =>
        useEmbeddedList<Item>(async () => ({ parentName: 'Queen', items: structuredClone(items) }), state, 'name'),
      url,
    )
    await result.reload()
    return result
  }

  it('loads the parent and sorts by the edit date, newest first, by default', async () => {
    const list = await embedded('/things')
    expect(list.parentName.value).toBe('Queen')
    expect(names(list.rows)).toEqual(['Alpha', 'beta', 'gamma'])
    expect(list.totalCount.value).toBe(3)
  })

  it('sorts by name regardless of case, in both directions', async () => {
    expect(names((await embedded('/things/sort/name/asc/search')).rows)).toEqual(['Alpha', 'beta', 'gamma'])
    expect(names((await embedded('/things/sort/name/desc/search')).rows)).toEqual(['gamma', 'beta', 'Alpha'])
  })

  it('sorts by the published flag, missing values last', async () => {
    const list = await embedded('/things/sort/published/asc/search')
    expect(names(list.rows)).toEqual(['Alpha', 'beta', 'gamma'])
  })

  it('searches the name case-insensitively and counts what is left', async () => {
    const list = await embedded('/things/sort/name/asc/search/ALP')
    expect(names(list.rows)).toEqual(['Alpha'])
    expect(list.totalCount.value).toBe(1)
  })
})
