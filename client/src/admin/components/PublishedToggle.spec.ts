import { afterEach, describe, expect, it, vi } from 'vitest'
import PublishedToggle from './PublishedToggle.vue'
import { flush, mountWithPlugins } from '../test/helpers'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('PublishedToggle', () => {
  it('asks to flip the state and shows a spinner until the request settles', async () => {
    let finish!: () => void
    const toggle = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    const { wrapper } = mountWithPlugins(PublishedToggle, { props: { published: false, toggle } })

    expect(wrapper.get('button').attributes('title')).toBe('Publish')
    await wrapper.get('button').trigger('click')

    expect(toggle).toHaveBeenCalledWith(true)
    expect(wrapper.find('[data-testid="published-saving"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(false)

    finish()
    await flush()
    expect(wrapper.find('[data-testid="published-saving"]').exists()).toBe(false)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('offers to unpublish a published item', async () => {
    const toggle = vi.fn().mockResolvedValue(undefined)
    const { wrapper } = mountWithPlugins(PublishedToggle, { props: { published: true, toggle } })

    expect(wrapper.get('button').attributes('title')).toBe('Unpublish')
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
    await wrapper.get('button').trigger('click')
    expect(toggle).toHaveBeenCalledWith(false)
  })
})
