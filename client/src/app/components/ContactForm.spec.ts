import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { mountWithApp } from '../test/helpers'
import ContactForm from './ContactForm.vue'

const send = vi.hoisted(() => vi.fn())
vi.mock('@shared/api/resources/public', () => ({ contactsApi: { send } }))

type Wrapper = Awaited<ReturnType<typeof mountWithApp>>['wrapper']
const sendButton = (wrapper: Wrapper) => wrapper.get('button[type="submit"]')

async function fill(wrapper: Wrapper, values: Partial<Record<'name' | 'email' | 'phone' | 'message', string>>) {
  for (const [field, value] of Object.entries(values)) await wrapper.get(`#${field}`).setValue(value)
}

describe('ContactForm', () => {
  beforeEach(() => {
    send.mockReset()
  })
  afterEach(() => document.body.replaceChildren())

  it('has a visible label for every field and the right input types', async () => {
    const { wrapper } = await mountWithApp(ContactForm)

    expect(wrapper.findAll('label').map((label) => label.text())).toEqual([
      'Name *',
      'Email *',
      'Phone (optional)',
      'Message *',
    ])
    expect(wrapper.get('#email').attributes()).toMatchObject({ type: 'email', autocomplete: 'email' })
    expect(wrapper.get('#phone').attributes()).toMatchObject({ type: 'tel', autocomplete: 'tel' })
    expect(wrapper.get('#name').attributes('autocomplete')).toBe('name')
  })

  it('has no Reset button', async () => {
    const { wrapper } = await mountWithApp(ContactForm)

    expect(wrapper.find('button[type="reset"]').exists()).toBe(false)
  })

  it('explains what is missing when sending an incomplete form and does not send it', async () => {
    const { wrapper } = await mountWithApp(ContactForm)
    expect(sendButton(wrapper).attributes('disabled')).toBeUndefined()

    await wrapper.get('form').trigger('submit')

    expect(send).not.toHaveBeenCalled()
    expect(wrapper.get('#name-error').text()).toBe('Please enter your name.')
    expect(wrapper.get('#email-error').text()).toBe('Please enter your email address.')
    expect(wrapper.get('#message-error').text()).toBe('Please write a message.')
    expect(wrapper.get('#name').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#name').attributes('aria-describedby')).toBe('name-error')
    expect(document.activeElement).toBe(wrapper.get('#name').element)
  })

  it('shows the e-mail error once the field was left', async () => {
    const { wrapper } = await mountWithApp(ContactForm)
    await wrapper.get('#email').setValue('anna@')
    expect(wrapper.find('#email-error').exists()).toBe(false)

    await wrapper.get('#email').trigger('blur')

    expect(wrapper.get('#email-error').text()).toBe('Email is invalid.')
    expect(wrapper.get('#email').attributes('aria-invalid')).toBe('true')
  })

  it('posts { name, email, phone, message }, announces success and clears the form', async () => {
    send.mockResolvedValue({})
    const { wrapper } = await mountWithApp(ContactForm)
    await fill(wrapper, {
      name: 'Anna',
      email: 'anna@example.com',
      phone: '+380501234567',
      message: 'Hello',
    })

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(send).toHaveBeenCalledWith({
      name: 'Anna',
      email: 'anna@example.com',
      phone: '+380501234567',
      message: 'Hello',
    })
    expect(wrapper.get('[role="status"]').text()).toContain('Thank you')
    expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('')
    expect(wrapper.find('#name-error').exists()).toBe(false)
  })

  it('disables Send and says so while sending', async () => {
    let finish: () => void = () => {}
    send.mockReturnValue(new Promise<void>((resolve) => (finish = resolve)))
    const { wrapper } = await mountWithApp(ContactForm)
    await fill(wrapper, { name: 'Anna', email: 'anna@example.com', message: 'Hello' })

    await wrapper.get('form').trigger('submit')

    expect(sendButton(wrapper).attributes('disabled')).toBeDefined()
    expect(sendButton(wrapper).text()).toBe('Sending…')

    finish()
    await flushPromises()
    expect(sendButton(wrapper).text()).toBe('Send')
  })

  it('reports a failed send and keeps what was typed', async () => {
    send.mockRejectedValue(new Error('500'))
    const { wrapper } = await mountWithApp(ContactForm)
    await fill(wrapper, { name: 'Anna', email: 'anna@example.com', message: 'Hello' })

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('could not be sent')
    expect((wrapper.get('#name').element as HTMLInputElement).value).toBe('Anna')
    expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('Hello')
    expect(sendButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('prefills the message and names what it is about', async () => {
    const { wrapper } = await mountWithApp(ContactForm, {
      props: { initialMessage: 'Hello! About ANNA\n', context: 'ANNA' },
    })

    expect((wrapper.get('#message').element as HTMLTextAreaElement).value).toBe('Hello! About ANNA\n')
    expect(wrapper.get('.contact-context').text()).toBe('Your message is about ANNA.')
  })
})
