<script setup lang="ts">
import { computed } from 'vue'
import type { ContactGroup } from '@shared/types'
import { contactHref, isRetiredChannel } from '../contactLink'
import { iconForClass } from '../icons'

const props = defineProps<{ list: ContactGroup[] }>()

const groups = computed(() => props.list.filter((group) => !isRetiredChannel(group.css_class)))
</script>

<template>
  <ul class="contact-groups">
    <li v-for="contactGroup in groups" :key="contactGroup.id" class="contact-group">
      <component :is="iconForClass(contactGroup.css_class)" class="contact-group-icon" aria-hidden="true" />
      <div>
        <h2 class="contact-group-title">{{ contactGroup.name }}</h2>
        <p v-for="contact in contactGroup.contacts" :key="contact.id" class="contact-group-item">
          <a
            v-if="contactHref(contactGroup.css_class, contact.name)"
            :href="contactHref(contactGroup.css_class, contact.name)"
          >
            {{ contact.name }}
          </a>
          <template v-else>{{ contact.name }}</template>
        </p>
      </div>
    </li>
  </ul>
</template>

<style>
.contact-group {
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid var(--color-line);
}
.contact-group:first-child {
  padding-top: 0;
}
.contact-group-icon {
  flex: none;
  width: 24px;
  height: 24px;
  margin-top: 4px;
  color: var(--color-taupe);
}
.contact-group-title {
  margin: 0 0 4px;
  font-family: var(--site-sans);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.contact-group-item {
  margin: 0;
}
.contact-group-item a {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  text-decoration: underline;
  text-decoration-color: var(--color-line);
  text-underline-offset: 4px;
}
</style>
