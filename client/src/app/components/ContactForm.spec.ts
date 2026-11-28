import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithApp } from '../test/helpers'
import { useNotifier } from '../stores/notifier'
import ContactForm from './ContactForm.vue'

const send = vi.hoisted(() => vi.fn())
vi.mock('@shared/api/resources/public', () => ({ contactsApi: { send } }))

const sendButton = (wrapper: Awaited<ReturnType<typeof mountWithApp>>['wrapper']) =>
  wrapper.get('button[type="submit"]')

describe('ContactForm', () => {
  beforeEach(() => {
    send.mockReset()
  })
  afterEach(() => document.body.replaceChildren())

  it('keeps Send disabled until name, a valid e-mail and a message are filled in', async () => {
    const { wrapper } = await mountWithApp(ContactForm)
    expect(sendButton(wrapper).attributes('disabled')).toBeDefined()

    await wrapper.get('#name').setValue('Anna')
    await wrapper.get('#email').setValue('not-an-email')
    await wrapper.get('#message').setValue('Hello')
    expect(sendButton(wrapper).attributes('disabled')).toBeDefined()

    await wrapper.get('#email').setValue('anna@example.com')
    expect(sendButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('shows the e-mail error only after the field was left', async () => {
    const { wrapper } = await mountWithApp(ContactForm)
    await wrapper.get('#email').setValue('anna@')
    expect(wrapper.find('.email-error').exists()).toBe(false)

    await wrapper.get('#email').trigger('blur')
    expect(wrapper.get('.email-error').text()).toBe('Email is invalid.')
    expect(wrapper.get('#email').classes()).toContain('invalid')
  })

  it('posts { name, email, phone, message }, announces success and clears the form', async () => {
    send.mockResolvedValue({})
    const { wrapper, pinia } = await mountWithApp(ContactForm)
    await wrapper.get('#name').setValue('Anna')
    await wrapper.get('#email').setValue('anna@example.com')
    await wrapper.get('#phone').setValue('+380501234567')
    await wrapper.get('#message').setValue('Hello')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(send).toHaveBeenCalledWith({
      name: 'Anna',
      email: 'anna@example.com',
      phone: '+380501234567',
      message: 'Hello',
    })
    const toasts = useNotifier(pinia).toasts
    expect(toasts).toHaveLength(1)
    expect(toasts[0]).toMatchObject({ kind: 'success', text: expect.stringContaining('Thank you') })
    expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('')
  })

  it('does not send an invalid form', async () => {
    const { wrapper } = await mountWithApp(ContactForm)
    await wrapper.get('form').trigger('submit')
    expect(send).not.toHaveBeenCalled()
    expect(wrapper.get('#name').classes()).toContain('invalid')
  })

  it('reports a failed send and keeps what was typed', async () => {
    send.mockRejectedValue(new Error('500'))
    const { wrapper, pinia } = await mountWithApp(ContactForm)
    await wrapper.get('#name').setValue('Anna')
    await wrapper.get('#email').setValue('anna@example.com')
    await wrapper.get('#message').setValue('Hello')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(useNotifier(pinia).toasts[0]?.kind).toBe('error')
    expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('Anna')
  })

  it('has no Reset button, so a message cannot be wiped by accident', async () => {
    const { wrapper } = await mountWithApp(ContactForm)

    expect(wrapper.find('button[type="reset"]').exists()).toBe(false)
  })

  it('shows a visible label for every field, linked to its input', async () => {
    const { wrapper } = await mountWithApp(ContactForm)

    const labels = wrapper.findAll('label')
    expect(labels.map((label) => label.attributes('for'))).toEqual(['name', 'email', 'phone', 'message'])
    expect(labels.every((label) => !label.classes().includes('sr-only'))).toBe(true)
    expect(wrapper.get('#email').attributes('type')).toBe('email')
    expect(wrapper.get('#phone').attributes('type')).toBe('tel')
  })

  it('prefills the message with the product named in the URL', async () => {
    const { wrapper } = await mountWithApp(ContactForm, { path: '/contacts?product=Diana' })

    expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe(
      'Hello! I would like to inquire about availability and pricing for "Diana".',
    )
  })

  it('starts empty without a product, and the prefill is plain editable text of a limited length', async () => {
    const plain = await mountWithApp(ContactForm, { path: '/contacts' })
    expect((plain.wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('')

    const long = await mountWithApp(ContactForm, { path: `/contacts?product=${'x'.repeat(500)}` })
    expect((long.wrapper.get('#message').element as HTMLTextAreaElement).value.length).toBeLessThan(250)
  })

  it('after a successful send the message is empty again, not prefilled', async () => {
    send.mockResolvedValue({})
    const { wrapper } = await mountWithApp(ContactForm, { path: '/contacts?product=Diana' })
    await wrapper.get('#name').setValue('Anna')
    await wrapper.get('#email').setValue('anna@example.com')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('')
  })
})
