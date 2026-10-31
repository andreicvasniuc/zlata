import { afterEach, describe, expect, it, vi } from 'vitest'
import EntityGrid, { type GridColumn } from './EntityGrid.vue'
import { byTestId, mountWithPlugins } from '../test/helpers'

interface Row {
  id: string
  name: string
  updated_at: string
  products_count: number
  published: boolean
  image?: { id: string; url: string }
}

const columns: GridColumn[] = [
  { field: 'image', header: 'COVER', kind: 'image' },
  { field: 'name', header: 'NAME', sortable: true },
  { field: 'updated_at', header: 'EDIT_DATE', kind: 'date', sortable: true },
  { field: 'products_count', header: 'PRODUCTS_COUNT', kind: 'count', linkTitle: 'GO_TO_PRODUCTS' },
]

const rows: Row[] = [
  {
    id: '1',
    name: 'Queen',
    updated_at: '2023-01-27T10:00:00.000Z',
    products_count: 3,
    published: true,
    image: { id: 'i1', url: 'https://example.test/queen.jpg' },
  },
  { id: '2', name: 'Love is', updated_at: '2022-07-25T10:00:00.000Z', products_count: 0, published: false },
]

const mountGrid = (props: Record<string, unknown> = {}) =>
  mountWithPlugins(EntityGrid, {
    props: {
      columns,
      rows,
      totalCount: 2,
      sortBy: 'updated_at',
      sortDirection: 'desc',
      published: true,
      upload: true,
      togglePublished: vi.fn().mockResolvedValue(undefined),
      ...props,
    },
  })

afterEach(() => {
  document.body.innerHTML = ''
})

describe('EntityGrid', () => {
  it('renders translated headers, cells, dates as dd/MM/yyyy and the count', () => {
    const { wrapper } = mountGrid()

    const headers = wrapper.findAll('th').map((th) => th.text())
    expect(headers).toEqual(expect.arrayContaining(['Cover', 'Name', 'Edit Date', 'Products count']))
    expect(wrapper.text()).toContain('Queen')
    expect(wrapper.text()).toContain('27/01/2023')
    expect(wrapper.find('img').attributes('src')).toBe('https://example.test/queen.jpg')
    expect(byTestId('grid-count')?.textContent?.trim()).toBe('2 items')
  })

  it.each([
    [1, '1 item'],
    [3, '3 items'], // ITEM_2_3_4 is "items" in English
    [12, '12 items'],
  ])('labels a total of %i as "%s"', (totalCount, text) => {
    mountGrid({ totalCount })
    expect(byTestId('grid-count')?.textContent?.trim()).toBe(text)
  })

  it('shows the empty message instead of rows', () => {
    const { wrapper } = mountGrid({ rows: [], totalCount: 0 })
    expect(wrapper.text()).toContain('No records found')
  })

  it('emits sort with the field and the toggled direction when a sortable header is clicked', async () => {
    const { wrapper } = mountGrid({ sortBy: 'name', sortDirection: 'asc' })

    const nameHeader = wrapper.findAll('th').find((th) => th.text().startsWith('Name'))
    await nameHeader?.trigger('click')

    expect(wrapper.emitted('sort')).toEqual([['name', 'desc']])
  })

  it('does not sort by columns that are not sortable', async () => {
    const { wrapper } = mountGrid()
    await wrapper
      .findAll('th')
      .find((th) => th.text().startsWith('Cover'))
      ?.trigger('click')
    expect(wrapper.emitted('sort')).toBeUndefined()
  })

  it('opens the editor when a row is clicked, but not from the toggle, the image or the count link', async () => {
    const { wrapper } = mountGrid()
    const firstRow = wrapper.findAll('tbody tr')[0]!

    await firstRow.findAll('td')[1]!.trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('edit')![0]).toEqual([rows[0]])

    await firstRow.find('[data-testid="published-toggle"]').trigger('click')
    await firstRow.find('img').trigger('click') // opens the image tab through "upload", not "edit"
    await firstRow.find('[title="Go to products"]').trigger('click')
    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('upload')).toHaveLength(1)
    expect(wrapper.emitted('open')).toEqual([[rows[0]]])
  })

  it('has edit, upload and delete actions per row', async () => {
    const { wrapper } = mountGrid()
    const firstRow = wrapper.findAll('tbody tr')[0]!

    await firstRow.find('[data-testid="edit"]').trigger('click')
    await firstRow.find('[data-testid="upload"]').trigger('click')
    await firstRow.find('[data-testid="delete"]').trigger('click')

    expect(wrapper.emitted('edit')).toHaveLength(1)
    expect(wrapper.emitted('upload')).toHaveLength(1)
    expect(wrapper.emitted('delete')).toEqual([[rows[0]]])
  })

  it('hides the upload action unless asked for', () => {
    const { wrapper } = mountGrid({ upload: false })
    expect(wrapper.find('[data-testid="upload"]').exists()).toBe(false)
  })

  it('asks to flip the published state of the clicked row (the toggle itself is tested in PublishedToggle)', async () => {
    const togglePublished = vi.fn().mockResolvedValue(undefined)
    const { wrapper } = mountGrid({ togglePublished })
    const toggles = wrapper.findAll('[data-testid="published-toggle"]')

    expect(toggles[0]!.attributes('title')).toBe('Unpublish')
    expect(toggles[1]!.attributes('title')).toBe('Publish')

    await toggles[1]!.trigger('click')
    await toggles[0]!.trigger('click')
    expect(togglePublished).toHaveBeenNthCalledWith(1, rows[1], true)
    expect(togglePublished).toHaveBeenNthCalledWith(2, rows[0], false)
  })

  it('asks for the next page when scrolled near the end, only for infinite grids', async () => {
    const { wrapper } = mountGrid({ infinite: true, totalCount: 30 })
    const scroller = wrapper.get('[data-testid="grid"]').element as HTMLElement
    Object.defineProperty(scroller, 'clientHeight', { value: 400, configurable: true })
    Object.defineProperty(scroller, 'scrollHeight', { value: 2000, configurable: true })

    scroller.scrollTop = 100
    await wrapper.get('[data-testid="grid"]').trigger('scroll')
    expect(wrapper.emitted('loadMore')).toBeUndefined()

    scroller.scrollTop = 1500
    await wrapper.get('[data-testid="grid"]').trigger('scroll')
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
  })

  it('does not ask for more once every row is loaded', async () => {
    const { wrapper } = mountGrid({ infinite: true, totalCount: 2 })
    const scroller = wrapper.get('[data-testid="grid"]').element as HTMLElement
    Object.defineProperty(scroller, 'clientHeight', { value: 400, configurable: true })
    Object.defineProperty(scroller, 'scrollHeight', { value: 410, configurable: true })

    await wrapper.get('[data-testid="grid"]').trigger('scroll')
    expect(wrapper.emitted('loadMore')).toBeUndefined()
  })
})
