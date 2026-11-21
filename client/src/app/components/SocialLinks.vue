<script setup lang="ts">
import { computed } from 'vue'
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { iconForClass } from '../icons'
import { useLoader } from '../composables/useLoader'

// `icons` (a row of icons) or `buttons` (outlined buttons with the network's name). `messengers` keeps only the
// networks people write to (Telegram, Instagram, Facebook, Viber, WhatsApp).
const props = withDefaults(defineProps<{ variant?: 'icons' | 'buttons'; messengers?: boolean }>(), {
  variant: 'icons',
})

const MESSENGER = /telegram|instagram|facebook|viber|whatsapp/i

const { data } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])
const networks = computed(() =>
  (data.value ?? []).filter((network) => !props.messengers || MESSENGER.test(`${network.css_class} ${network.slug}`)),
)
</script>

<template>
  <ul v-if="networks.length" class="social-links" :class="`social-links--${variant}`">
    <li v-for="socialNetworking in networks" :key="socialNetworking.id">
      <a
        :href="socialNetworking.url"
        target="_blank"
        rel="noopener noreferrer"
        :title="socialNetworking.name"
        :aria-label="variant === 'icons' ? socialNetworking.name : undefined"
      >
        <component :is="iconForClass(socialNetworking.css_class)" aria-hidden="true" />
        <span v-if="variant === 'buttons'">{{ socialNetworking.name }}</span>
      </a>
    </li>
  </ul>
</template>

<style>
.social-links {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}
.social-links--icons {
  gap: 4px;
  margin-left: -10px;
}
.social-links--icons a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  transition: opacity 0.2s ease;
}
.social-links--icons a:hover {
  opacity: 0.6;
}
.social-links--icons svg {
  width: 18px;
  height: 18px;
}
.social-links--buttons {
  gap: 10px;
}
.social-links--buttons a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 46px;
  padding: 0 18px;
  border: 1px solid var(--z-ink);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.social-links--buttons a:hover {
  background: var(--z-ink);
  color: var(--z-bg);
}
.social-links--buttons svg {
  width: 16px;
  height: 16px;
}
</style>
