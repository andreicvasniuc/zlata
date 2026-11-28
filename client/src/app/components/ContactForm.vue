<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { contactsApi } from '@shared/api/resources/public'
import { useNotifier } from '../stores/notifier'

const { t } = useI18n()
const route = useRoute()
const notifier = useNotifier()

// a loose address check; the server mails the message as it is
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// An enquiry from a product page names the product in the URL (`?product=Diana`). It only prefills the message, which
// the visitor can edit; it is plain text and never personal data.
const MAX_PRODUCT_LENGTH = 120
const product = typeof route.query.product === 'string' ? route.query.product.trim().slice(0, MAX_PRODUCT_LENGTH) : ''

const emptyForm = () => ({ name: '', email: '', phone: '', message: '' })
const form = reactive({ ...emptyForm(), message: product ? t('INQUIRY_PREFILL', { product }) : '' })
const touched = reactive({ name: false, email: false, phone: false, message: false })
const emailBlurred = ref(false)
const isSending = ref(false)

const errors = computed(() => ({
  name: form.name.trim() === '',
  email: form.email.trim() === '' || !EMAIL_PATTERN.test(form.email.trim()),
  message: form.message.trim() === '',
}))
const isInvalid = computed(() => errors.value.name || errors.value.email || errors.value.message)
const emailFormatError = computed(
  () => emailBlurred.value && form.email.trim() !== '' && !EMAIL_PATTERN.test(form.email.trim()),
)

function reset() {
  Object.assign(form, emptyForm())
  Object.assign(touched, { name: false, email: false, phone: false, message: false })
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
    })
    notifier.success(t('MESSAGE_SENT'))
    reset()
  } catch {
    // what was typed stays, so it can be sent again
    notifier.error(t('MESSAGE_FAILED'))
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <form class="contact-form" novalidate @submit.prevent="send">
    <div class="form-row">
      <div class="form-group">
        <label for="name" class="field-label">{{ t('NAME') }}</label>
        <input
          id="name"
          v-model="form.name"
          name="name"
          type="text"
          class="form-control"
          :class="{ invalid: touched.name && errors.name }"
          autocomplete="name"
          :placeholder="t('NAME')"
          required
          @blur="touched.name = true"
        />
      </div>

      <div class="form-group form-group-validate">
        <label for="email" class="field-label">{{ t('EMAIL') }}</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          class="form-control"
          :class="{ invalid: touched.email && errors.email }"
          autocomplete="email"
          :placeholder="t('EMAIL')"
          required
          @blur="((touched.email = true), (emailBlurred = true))"
        />
        <span v-if="emailFormatError" class="email-error" role="alert">{{ t('EMAIL_INVALID') }}</span>
      </div>
    </div>

    <div class="form-group">
      <label for="phone" class="field-label">{{ t('PHONE') }}</label>
      <input
        id="phone"
        v-model="form.phone"
        name="phone"
        type="tel"
        class="form-control"
        autocomplete="tel"
        :placeholder="t('PHONE')"
      />
    </div>

    <div class="form-group">
      <label for="message" class="field-label">{{ t('MESSAGE') }}</label>
      <textarea
        id="message"
        v-model="form.message"
        name="message"
        class="form-control"
        :class="{ invalid: touched.message && errors.message }"
        rows="5"
        :placeholder="t('MESSAGE')"
        required
        @blur="touched.message = true"
      ></textarea>
    </div>

    <button type="submit" class="btn btn-primary btn-block" :disabled="isInvalid || isSending">{{ t('SEND') }}</button>
  </form>
</template>

<style>
.contact-form .form-row {
  display: grid;
  gap: 0 20px;
}
@media (min-width: 640px) {
  .contact-form .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
.contact-form .form-control.invalid {
  border-color: #b3261e;
}
.contact-form .form-group-validate {
  position: relative;
}
.contact-form .form-group-validate .email-error {
  display: block;
  margin-top: 6px;
  font-size: 0.85rem;
  color: #b3261e;
}
</style>
