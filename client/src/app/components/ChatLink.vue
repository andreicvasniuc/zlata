<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconChat from '~icons/lucide/message-circle'
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'

// The phone header's chat button: opens Telegram, or Viber when the site has no Telegram link.
const { t } = useI18n()
const { data } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])

const url = computed(() => {
  const networks = data.value ?? []
  const find = (pattern: RegExp) => networks.find((network) => pattern.test(`${network.css_class} ${network.slug}`))
  return (find(/telegram/i) ?? find(/viber/i))?.url
})
</script>

<template>
  <a
    v-if="url"
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="icon-button chat-link"
    :aria-label="t('CHAT_WITH_US')"
  >
    <IconChat aria-hidden="true" />
  </a>
</template>

<style>
@media (min-width: 1024px) {
  .chat-link {
    display: none !important;
  }
}
</style>
