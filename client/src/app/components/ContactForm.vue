<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactsApi } from '@shared/api/resources/public'
import type { ContactIntent } from '../contacts'
import { useNotifier } from '../stores/notifier'

// `type` is the open tab: a fitting request (with a preferred date) or a question (the message is required).
// `dresses` pre-fills the dresses field, e.g. from the product page.
const props = defineProps<{ type: ContactIntent; dresses?: string }>()

const { t } = useI18n()
const notifier = useNotifier()

// a loose address check; the server mails the message as it is
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emptyForm = () => ({ name: '', email: '', phone: '', date: '', dresses: props.dresses ?? '', message: '' })
const form = reactive(emptyForm())
const touched = reactive({ name: false, email: false, message: false })
const emailBlurred = ref(false)
const isSending = ref(false)
const isSent = ref(false)

const isFitting = computed(() => props.type === 'fitting')
// a fitting date in the past makes no sense; the field's own `min` only guides the picker
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

const errors = computed(() => ({
  name: form.name.trim() === '',
  email: form.email.trim() === '' || !EMAIL_PATTERN.test(form.email.trim()),
  message: !isFitting.value && form.message.trim() === '',
}))
const isInvalid = computed(() => errors.value.name || errors.value.email || errors.value.message)
const emailFormatError = computed(
  () => emailBlurred.value && form.email.trim() !== '' && !EMAIL_PATTERN.test(form.email.trim()),
)
const emailError = computed(() => {
  if (emailFormatError.value) return t('EMAIL_INVALID')
  return touched.email && form.email.trim() === '' ? t('FIELD_REQUIRED') : ''
})

function clear() {
  Object.assign(form, emptyForm())
  Object.assign(touched, { name: false, email: false, message: false })
  emailBlurred.value = false
}

async function send() {
  touched.name = touched.email = touched.message = true
  if (isInvalid.value || isSending.value) return

  isSending.value = true
  try {
    await contactsApi.send({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || undefined,
      message: form.message.trim(),
      request_type: props.type,
      preferred_date: isFitting.value && form.date >= today ? form.date : undefined,
      dresses: form.dresses.trim() || undefined,
    })
    clear()
    isSent.value = true
  } catch {
    notifier.error(t('MESSAGE_FAILED'))
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div v-if="isSent" class="contact-form__success" role="status">
    <h3>{{ t('REQUEST_SENT_TITLE') }}</h3>
    <p>{{ t('MESSAGE_SENT') }}</p>
    <button type="button" class="btn btn--ghost" @click="isSent = false">{{ t('SEND_ANOTHER') }}</button>
  </div>

  <form v-else class="contact-form" novalidate @submit.prevent="send">
    <div class="contact-form__row">
      <label class="field" for="name">
        <span class="field__label">{{ t('NAME') }}</span>
        <input
          id="name"
          v-model="form.name"
          name="name"
          type="text"
          class="field__input"
          :class="{ invalid: touched.name && errors.name }"
          :aria-invalid="touched.name && errors.name"
          :aria-describedby="touched.name && errors.name ? 'name-error' : undefined"
          autocomplete="name"
          required
          @blur="touched.name = true"
        />
        <span v-if="touched.name && errors.name" id="name-error" class="field__error" role="alert">
          {{ t('FIELD_REQUIRED') }}
        </span>
      </label>

      <label class="field" for="phone">
        <span class="field__label">{{ t('PHONE') }}</span>
        <input
          id="phone"
          v-model="form.phone"
          name="phone"
          type="tel"
          inputmode="tel"
          class="field__input"
          autocomplete="tel"
        />
      </label>
    </div>

    <label class="field" for="email">
      <span class="field__label">{{ t('EMAIL') }}</span>
      <input
        id="email"
        v-model="form.email"
        name="email"
        type="email"
        class="field__input"
        :class="{ invalid: touched.email && errors.email }"
        :aria-invalid="touched.email && errors.email"
        :aria-describedby="emailError ? 'email-error' : undefined"
        autocomplete="email"
        required
        @blur="((touched.email = true), (emailBlurred = true))"
      />
      <span v-if="emailError" id="email-error" class="field__error email-error" role="alert">
        {{ emailError }}
      </span>
    </label>

    <div class="contact-form__row">
      <label v-if="isFitting" class="field" for="date">
        <span class="field__label">{{ t('PREFERRED_DATE') }}</span>
        <input id="date" v-model="form.date" name="date" type="date" class="field__input" :min="today" />
      </label>

      <label class="field" for="dresses">
        <span class="field__label">{{ t(isFitting ? 'DRESSES_TO_TRY' : 'ABOUT_DRESS') }}</span>
        <input id="dresses" v-model="form.dresses" name="dresses" type="text" class="field__input" />
      </label>
    </div>

    <label class="field" for="message">
      <span class="field__label">{{ t(isFitting ? 'MESSAGE_OPTIONAL' : 'MESSAGE') }}</span>
      <textarea
        id="message"
        v-model="form.message"
        name="message"
        class="field__input"
        :class="{ invalid: touched.message && errors.message }"
        :aria-invalid="touched.message && errors.message"
        :aria-describedby="touched.message && errors.message ? 'message-error' : undefined"
        rows="5"
        :required="!isFitting"
        @blur="touched.message = true"
      ></textarea>
      <span v-if="touched.message && errors.message" id="message-error" class="field__error" role="alert">
        {{ t('FIELD_REQUIRED') }}
      </span>
    </label>

    <button type="submit" class="btn btn--block" :disabled="isSending">{{ t('SEND_REQUEST') }}</button>
    <p class="contact-form__note">{{ t('REQUIRED_FIELDS') }}</p>
  </form>
</template>

<style>
@media (min-width: 600px) {
  .contact-form__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
}
.contact-form .btn {
  margin-top: 8px;
}
.contact-form__note {
  margin-top: 14px;
  font-size: 12.5px;
  color: var(--z-muted);
  text-align: center;
}
.contact-form__success {
  padding: 24px 0;
}
.contact-form__success h3 {
  font-size: clamp(28px, 3vw, 36px);
}
.contact-form__success p {
  margin: 12px 0 28px;
  color: var(--z-muted);
}
</style>
