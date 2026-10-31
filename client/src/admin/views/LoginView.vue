<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import { useSession } from '@shared/auth/session'
import { deleteLegacyCredentialCookies } from '@shared/auth/token'
import LanguageSelector from '../components/LanguageSelector.vue'
import { useNotify } from '../composables/useNotify'

const { t } = useI18n()
const router = useRouter()
const session = useSession()
const notify = useNotify()

const email = ref('')
const password = ref('')
const submitted = ref(false)
const busy = ref(false)

const emailInvalid = computed(() => submitted.value && !/^\S+@\S+$/.test(email.value))
const passwordInvalid = computed(() => submitted.value && password.value === '')

// older versions stored the e-mail and the plain-text password in cookies
onMounted(deleteLegacyCredentialCookies)

async function signIn() {
  submitted.value = true
  if (emailInvalid.value || passwordInvalid.value) return

  busy.value = true
  const result = await session.login(email.value.trim(), password.value)
  busy.value = false

  if (result === 'ok') {
    const target = session.redirectTo ?? '/'
    session.redirectTo = null
    await router.push(target)
  } else if (result === 'invalid-credentials') {
    notify.error('INCORRECT_EMAIL_OR_PASSWORD', true)
  } else {
    notify.error('SOMETHING_WENT_WRONG')
  }
}
</script>

<template>
  <div class="min-h-screen bg-surface px-4 pt-[10vh]">
    <div class="mx-auto mb-4 flex max-w-sm justify-end"><LanguageSelector /></div>
    <form
      class="mx-auto max-w-sm border border-border bg-white"
      novalidate
      data-testid="login-form"
      @submit.prevent="signIn"
    >
      <h1 class="border-b border-border bg-surface px-6 py-3 text-xl font-normal">{{ t('LOGIN') }}</h1>
      <div class="flex flex-col gap-4 p-6">
        <div class="flex flex-col gap-1">
          <label for="login-email">{{ t('EMAIL') }}</label>
          <InputText
            id="login-email"
            v-model="email"
            type="email"
            autocomplete="username"
            :invalid="emailInvalid"
            autofocus
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="login-password">{{ t('PASSWORD') }}</label>
          <Password
            v-model="password"
            input-id="login-password"
            autocomplete="current-password"
            :feedback="false"
            toggle-mask
            :invalid="passwordInvalid"
            fluid
          />
        </div>
        <Button type="submit" :label="t('SIGN_IN')" :loading="busy" data-testid="login-submit" />
      </div>
    </form>
  </div>
</template>
