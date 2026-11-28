import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { collectionsApi } from '@shared/api/resources/collections'
import type { Collection } from '@shared/types'
import CollectionEditor from './CollectionEditor.vue'
import { allByTestId, byTestId, flush, mountWithPlugins, setValue } from '../test/helpers'

vi.mock('@shared/api/resources/collections', () => ({
  collectionsApi: { create: vi.fn(), update: vi.fn(), uploadImage: vi.fn() },
}))

const collection: Collection = {
  id: 'c1',
  slug: 'queen',
  name: 'Queen',
  description: 'Royal dresses',
  published: true,
  has_accessories: false,
  products_count: 2,
}

function mountEditor(props: Record<string, unknown> = {}) {
  const { wrapper } = mountWithPlugins(CollectionEditor, {
    props: {
      visible: true,
      'onUpdate:visible': (visible: boolean) => void wrapper.setProps({ visible }),
      ...props,
    },
  })
  return wrapper
}

const field = (id: string) => document.getElementById(id) as HTMLInputElement
const saveButton = () => byTestId('editor-save') as HTMLButtonElement
const tab = (name: string) =>
  [...document.body.querySelectorAll<HTMLElement>('[role="tab"]')].find(
    (element) => element.textContent?.trim() === name,
  )

beforeEach(() => vi.clearAllMocks())
afterEach(() => {
  document.body.innerHTML = ''
})

describe('CollectionEditor', () => {
  it('creates a collection: the name is required, then the image tab opens', async () => {
    vi.mocked(collectionsApi.create).mockResolvedValue({ ...collection, slug: 'new-one', name: 'New one' })
    mountEditor()
    await flush()

    expect(document.body.textContent).toContain('Create Collection')
    expect(saveButton().disabled).toBe(true)
    expect(
      tab('Image uploading')?.getAttribute('aria-disabled') ?? tab('Image uploading')?.hasAttribute('disabled'),
    ).toBeTruthy()

    setValue(field('collection-name'), 'New one')
    setValue(field('collection-description'), 'About it')
    await flush()
    expect(saveButton().disabled).toBe(false)

    saveButton().click()
    await flush()

    expect(collectionsApi.create).toHaveBeenCalledWith({
      name: 'New one',
      description: 'About it',
      published: false,
      has_accessories: false,
    })
    expect(tab('Image uploading')?.getAttribute('aria-selected')).toBe('true')
    expect(byTestId('image-url')).not.toBeNull()
  })

  it('uploads the image by URL for the created collection and shows it', async () => {
    vi.mocked(collectionsApi.create).mockResolvedValue({ ...collection, slug: 'new-one' })
    vi.mocked(collectionsApi.uploadImage).mockResolvedValue({
      ...collection,
      slug: 'new-one',
      image: { id: 'i1', url: 'https://example.test/cover.jpg' },
    })
    mountEditor()
    await flush()
    setValue(field('collection-name'), 'New one')
    await flush()
    saveButton().click()
    await flush()

    setValue(byTestId('image-url'), '  https://example.test/cover.jpg ')
    await flush()
    byTestId('image-upload')!.click()
    await flush()

    expect(collectionsApi.uploadImage).toHaveBeenCalledWith('new-one', 'https://example.test/cover.jpg')
    expect(byTestId('image-preview')?.querySelector('img')?.getAttribute('src')).toBe('https://example.test/cover.jpg')
  })

  it('edits an existing collection by its slug and closes', async () => {
    vi.mocked(collectionsApi.update).mockResolvedValue(collection)
    const wrapper = mountEditor({ collection })
    await flush()

    expect(document.body.textContent).toContain('Edit Collection')
    expect(field('collection-name').value).toBe('Queen')
    expect(field('collection-description').value).toBe('Royal dresses')

    setValue(field('collection-name'), 'Queen 2')
    await flush()
    saveButton().click()
    await flush()

    expect(collectionsApi.update).toHaveBeenCalledWith('queen', {
      name: 'Queen 2',
      description: 'Royal dresses',
      published: true,
      has_accessories: false,
    })
    expect(collectionsApi.create).not.toHaveBeenCalled()
    expect(wrapper.props('visible')).toBe(false)
  })

  it('starts on the image tab when asked to and shows the current image', async () => {
    mountEditor({
      collection: { ...collection, image: { id: 'i1', url: 'https://example.test/cover.jpg' } },
      startTab: 'images',
    })
    await flush()

    expect(tab('Image uploading')?.getAttribute('aria-selected')).toBe('true')
    expect(byTestId('image-preview')).not.toBeNull()
    // the Edit button belongs to the basic tab only
    expect(allByTestId('editor-save')).toHaveLength(0)
  })

  it('lets the user remove the shown image to enter another URL', async () => {
    mountEditor({
      collection: { ...collection, image: { id: 'i1', url: 'https://example.test/cover.jpg' } },
      startTab: 'images',
    })
    await flush()

    byTestId('image-remove')!.click()
    await flush()

    expect(byTestId('image-preview')).toBeNull()
    expect(byTestId('image-url')).not.toBeNull()
  })

  it('does not close when saving fails', async () => {
    vi.mocked(collectionsApi.update).mockRejectedValue(new Error('boom'))
    const wrapper = mountEditor({ collection })
    await flush()

    saveButton().click()
    await flush()

    expect(wrapper.props('visible')).toBe(true)
  })
})
