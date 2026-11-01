<script setup lang="ts">
import { computed, nextTick, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactsApi } from '@shared/api/resources/public'

// `initialMessage` prefills the message (e.g. an enquiry about a dress); `context` names what it is about.
const props = defineProps<{ initialMessage?: string; context?: string }>()

const { t } = useI18n()

// a loose address check; the server mails the message as it is
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emptyForm = () => ({ name: '', email: '', phone: '', message: props.initialMessage ?? '' })
const form = reactive(emptyForm())
const touched = reactive({ name: false, email: false, message: false })
const isSending = ref(false)
const status = ref<'idle' | 'sent' | 'failed'>('idle')
const root = ref<HTMLFormElement | null>(null)

const errorKeys = computed(() => ({
  name: form.name.trim() === '' ? 'NAME_REQUIRED' : undefined,
  email:
    form.email.trim() === '' ? 'EMAIL_REQUIRED' : !EMAIL_PATTERN.test(form.email.trim()) ? 'EMAIL_INVALID' : undefined,
  message: form.message.trim() === '' ? 'MESSAGE_REQUIRED' : undefined,
}))
const isInvalid = computed(() => Object.values(errorKeys.value).some(Boolean))
const shown = (field: keyof typeof touched) => (touched[field] ? errorKeys.value[field] : undefined)

function reset() {
  Object.assign(form, { name: '', email: '', phone: '', message: '' })
  Object.assign(touched, { name: false, email: false, message: false })
}

async function send() {
  touched.name = touched.email = touched.message = true
  status.value = 'idle'
  if (isInvalid.value) {
    await nextTick()
    root.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }
  if (isSending.value) return

  isSending.value = true
  try {
    await contactsApi.send({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim(),
    })
    status.value = 'sent'
    reset()
  } catch {
    // what was typed stays, so it can be sent again
    status.value = 'failed'
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <form ref="root" class="contact-form" novalidate @submit.prevent="send">
    <p v-if="context" class="contact-context">{{ t('ENQUIRY_ABOUT', { name: context }) }}</p>
    <p class="required-note">{{ t('REQUIRED_NOTE') }}</p>

    <div class="field">
      <label for="name">{{ t('NAME') }} <span class="required" aria-hidden="true">*</span></label>
      <input
        id="name"
        v-model="form.name"
        name="name"
        type="text"
        class="field-control"
        autocomplete="name"
        required
        :aria-invalid="!!shown('name')"
        :aria-describedby="shown('name') ? 'name-error' : undefined"
        @blur="touched.name = true"
      />
      <p v-if="shown('name')" id="name-error" class="field-error">{{ t(shown('name')!) }}</p>
    </div>

    <div class="field">
      <label for="email">{{ t('EMAIL') }} <span class="required" aria-hidden="true">*</span></label>
      <input
        id="email"
        v-model="form.email"
        name="email"
        type="email"
        class="field-control"
        autocomplete="email"
        required
        :aria-invalid="!!shown('email')"
        :aria-describedby="shown('email') ? 'email-error' : undefined"
        @blur="touched.email = true"
      />
      <p v-if="shown('email')" id="email-error" class="field-error">{{ t(shown('email')!) }}</p>
    </div>

    <div class="field">
      <label for="phone">{{ t('PHONE') }}</label>
      <input id="phone" v-model="form.phone" name="phone" type="tel" class="field-control" autocomplete="tel" />
    </div>

    <div class="field">
      <label for="message">{{ t('MESSAGE') }} <span class="required" aria-hidden="true">*</span></label>
      <textarea
        id="message"
        v-model="form.message"
        name="message"
        class="field-control"
        rows="6"
        required
        :aria-invalid="!!shown('message')"
        :aria-describedby="shown('message') ? 'message-error' : undefined"
        @blur="touched.message = true"
      ></textarea>
      <p v-if="shown('message')" id="message-error" class="field-error">{{ t(shown('message')!) }}</p>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="isSending">
      {{ isSending ? t('SENDING') : t('SEND') }}
    </button>

    <p v-if="status === 'sent'" class="form-status form-status-success" role="status">{{ t('MESSAGE_SENT') }}</p>
    <p v-else-if="status === 'failed'" class="form-status field-error" role="alert">{{ t('MESSAGE_FAILED') }}</p>
  </form>
</template>

<style>
.contact-form .contact-context {
  padding: 12px 16px;
  background: var(--color-sand);
}
.contact-form .required-note {
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.contact-form .form-status {
  margin-top: 16px;
}
.contact-form .form-status-success {
  color: #2e6a3b;
}
</style>
