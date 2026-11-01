<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { iconForClass } from '../icons'
import { useLoader } from '../composables/useLoader'

const { t } = useI18n()
const { data } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])
</script>

<template>
  <ul v-if="data?.length" class="social-links" :aria-label="t('FOLLOW_US')">
    <li v-for="socialNetworking in data" :key="socialNetworking.id">
      <a
        :href="socialNetworking.url"
        :title="socialNetworking.name"
        :aria-label="socialNetworking.name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <component :is="iconForClass(socialNetworking.css_class)" class="size-6" aria-hidden="true" />
      </a>
    </li>
  </ul>
</template>

<style>
.social-links {
  display: flex;
  gap: 4px;
}
.social-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}
</style>
