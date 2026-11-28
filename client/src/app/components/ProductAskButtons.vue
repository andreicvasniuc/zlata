<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'

// "Ask on Instagram" / "Ask on Telegram": a link for each of these networks the site has set up in the admin.
const NETWORKS = ['ti-instagram', 'ti-telegram']

const { t } = useI18n()
const { data } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])
const links = computed(() => (data.value ?? []).filter((item) => item.css_class && NETWORKS.includes(item.css_class)))
</script>

<template>
  <div v-if="links.length" class="ask-buttons">
    <a
      v-for="link in links"
      :key="link.id"
      :href="link.url"
      class="btn btn-outline btn-block"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ t('ASK_ON', { network: link.name }) }}
    </a>
  </div>
</template>

<style>
.ask-buttons {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}
</style>
