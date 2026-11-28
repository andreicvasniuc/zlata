<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ContactGroup } from '@shared/types'
import { contactHref } from '../contactLink'

defineProps<{ list: ContactGroup[] }>()

const { t } = useI18n()

// what the link does, named for the visitor: "Send email", "Call", "Chat"
function actionFor(href: string): string {
  if (href.startsWith('mailto:')) return t('ACTION_EMAIL')
  if (href.startsWith('tel:')) return t('ACTION_CALL')
  return t('ACTION_CHAT')
}
</script>

<template>
  <ul class="contact-cards">
    <li v-for="contactGroup in list" :key="contactGroup.id" class="contact-card">
      <h2 class="contact-card-title">{{ contactGroup.name }}</h2>
      <template v-for="contact in contactGroup.contacts" :key="contact.id">
        <a
          v-if="contactHref(contactGroup.css_class, contact.name)"
          :href="contactHref(contactGroup.css_class, contact.name)"
          class="contact-card-row"
        >
          <span class="contact-card-value">{{ contact.name }}</span>
          <span class="contact-card-action">{{ actionFor(contactHref(contactGroup.css_class, contact.name)!) }} ↗</span>
        </a>
        <p v-else class="contact-card-row">
          <span class="contact-card-value">{{ contact.name }}</span>
        </p>
      </template>
    </li>
  </ul>
</template>

<style>
.contact-cards {
  display: grid;
  gap: 16px;
}
.contact-card {
  padding: 20px 24px;
  background: #fff;
  border: 1px solid var(--color-border);
}
.contact-card-title {
  margin: 0 0 6px;
  font-family: var(--site-sans);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-accent-text);
}
.contact-card-row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 16px;
  margin: 0;
  padding: 4px 0;
}
.contact-card-value {
  font-size: 1.15rem;
  overflow-wrap: anywhere;
}
.contact-card-action {
  border-bottom: 1px solid var(--color-border);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
a.contact-card-row:hover .contact-card-action {
  border-color: var(--color-accent);
  color: var(--color-ink);
}
</style>
