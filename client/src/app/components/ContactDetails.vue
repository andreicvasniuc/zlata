<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ContactGroup } from '@shared/types'
import { contactHref, isShownContactGroup, SALON_MAP_EMBED_URL, SALON_MAP_URL } from '../contacts'
import SocialLinks from './SocialLinks.vue'

// The salon (address, opening hours), the contact groups from the admin (e-mail, Viber, ...), the messengers and the map.
const props = defineProps<{ groups: ContactGroup[] }>()

const { t } = useI18n()
const shown = computed(() => props.groups.filter(isShownContactGroup))
</script>

<template>
  <div class="contact-details">
    <div class="contact-details__block">
      <h3 class="eyebrow contact-details__title">{{ t('SALON') }}</h3>
      <p class="contact-details__value">{{ t('LONG_SITE_NAME') }}</p>
      <p class="contact-details__text">{{ t('SALON_ADDRESS') }}</p>
      <p class="contact-details__text">{{ t('SALON_HOURS') }}</p>
    </div>

    <div v-for="group in shown" :key="group.id" class="contact-details__block">
      <h3 class="eyebrow contact-details__title">{{ group.name }}</h3>
      <p v-for="contact in group.contacts" :key="contact.id" class="contact-details__value">
        <a v-if="contactHref(group, contact.name)" :href="contactHref(group, contact.name)">{{ contact.name }}</a>
        <span v-else>{{ contact.name }}</span>
      </p>
    </div>

    <div class="contact-details__block">
      <h3 class="eyebrow contact-details__title">{{ t('MESSAGE_US') }}</h3>
      <SocialLinks variant="buttons" messengers />
    </div>

    <div class="contact-details__block">
      <iframe
        class="contact-details__map"
        :src="SALON_MAP_EMBED_URL"
        :title="t('SALON_MAP')"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
      <a :href="SALON_MAP_URL" target="_blank" rel="noopener noreferrer" class="text-link">
        {{ t('OPEN_IN_GOOGLE_MAPS') }}
      </a>
    </div>
  </div>
</template>

<style>
.contact-details__block {
  padding: 26px 0;
  border-bottom: 1px solid var(--z-line);
}
.contact-details__block:first-child {
  padding-top: 0;
}
.contact-details__block:last-child {
  border-bottom: 0;
}
.contact-details__title {
  margin-bottom: 10px;
}
.contact-details__text {
  margin-top: 6px;
  font-size: 15px;
  color: var(--z-muted);
}
.contact-details__map {
  display: block;
  width: 100%;
  height: 280px;
  margin-bottom: 14px;
  border: 0;
  background: var(--z-soft);
}
.contact-details__value {
  font-family: var(--z-serif);
  font-size: clamp(22px, 2.4vw, 28px);
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.contact-details__value a {
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.3s ease;
}
.contact-details__value a:hover {
  background-size: 100% 1px;
}
</style>
