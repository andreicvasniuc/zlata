<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactsApi } from '@shared/api/resources/public'
import { useNotifier } from '../stores/notifier'

const { t } = useI18n()
const notifier = useNotifier()

// a loose address check; the server mails the message as it is
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emptyForm = () => ({ name: '', email: '', phone: '', message: '' })
const form = reactive(emptyForm())
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
    notifier.error(t('MESSAGE_FAILED'))
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <form class="contact-form" novalidate @submit.prevent="send" @reset.prevent="reset">
    <div class="col-md-12">
      <div class="form-group">
        <label for="name" class="sr-only">{{ t('NAME') }}</label>
        <input
          id="name"
          v-model="form.name"
          name="name"
          type="text"
          class="form-control"
          :class="{ invalid: touched.name && errors.name }"
          :placeholder="t('NAME')"
          required
          @blur="touched.name = true"
        />
      </div>
    </div>

    <div class="col-md-12">
      <div class="form-group form-group-validate">
        <label for="email" class="sr-only">{{ t('EMAIL') }}</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="text"
          class="form-control"
          :class="{ invalid: touched.email && errors.email }"
          :placeholder="t('EMAIL')"
          required
          @blur="((touched.email = true), (emailBlurred = true))"
        />
        <span v-if="emailFormatError" class="email-error" role="alert">{{ t('EMAIL_INVALID') }}</span>
      </div>
    </div>

    <div class="col-md-12">
      <div class="form-group">
        <label for="phone" class="sr-only">{{ t('PHONE') }}</label>
        <input
          id="phone"
          v-model="form.phone"
          name="phone"
          type="text"
          class="form-control"
          :placeholder="t('PHONE')"
        />
      </div>
    </div>

    <div class="col-md-12">
      <div class="form-group">
        <label for="message" class="sr-only">{{ t('MESSAGE') }}</label>
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          class="form-control"
          :class="{ invalid: touched.message && errors.message }"
          rows="3"
          :placeholder="t('MESSAGE')"
          required
          @blur="touched.message = true"
        ></textarea>
      </div>
    </div>

    <div class="col-md-12">
      <div class="form-group">
        <button type="submit" class="btn btn-primary" :disabled="isInvalid || isSending">{{ t('SEND') }}</button>
        <button type="reset" class="btn btn-outline">{{ t('RESET') }}</button>
      </div>
    </div>
  </form>
</template>

<style>
.contact-form .form-control.invalid {
  border-color: #f00;
}
.contact-form .form-control.invalid::placeholder {
  color: #ff4d4d;
  opacity: 1;
}
.contact-form .form-group-validate {
  position: relative;
}
.contact-form .form-group-validate .email-error {
  position: absolute;
  color: #f00;
}
</style>
