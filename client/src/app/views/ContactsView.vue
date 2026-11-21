<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { contactGroupsApi } from '@shared/api/resources/public'
import ContactDetails from '../components/ContactDetails.vue'
import ContactForm from '../components/ContactForm.vue'
import PageLayout from '../components/PageLayout.vue'
import type { ContactIntent } from '../contacts'
import { useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
const route = useRoute()
const title = computed(() => t('CONTACTS'))
usePageTitle(title)

const { data } = useLoader(async () => (await contactGroupsApi.list()).contact_groups ?? [])

// `?intent=fitting|question&dress=Elayza` comes from the "Book a fitting" and "Ask about this dress" buttons
const intentOf = (): ContactIntent => (route.query.intent === 'question' ? 'question' : 'fitting')
const tab = ref<ContactIntent>(intentOf())
watch(
  () => route.fullPath,
  () => (tab.value = intentOf()),
)

const dress = computed(() => (typeof route.query.dress === 'string' ? route.query.dress.trim() : ''))

const tabs: { id: ContactIntent; label: string }[] = [
  { id: 'fitting', label: 'BOOK_FITTING' },
  { id: 'question', label: 'ASK_QUESTION' },
]

// the arrow keys move between the tabs, like in a native tab list
function onTabKey(event: KeyboardEvent, index: number) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  const next = tabs[(index + step + tabs.length) % tabs.length]!
  tab.value = next.id
  document.getElementById(`contact-tab-${next.id}`)?.focus()
}
</script>

<template>
  <PageLayout :heading="title" :intro="t('CONTACTS_INTRO')" :breadcrumb="[{ name: title }]">
    <div class="wrap listing contacts">
      <section class="contacts__form">
        <div class="contacts__tabs" role="tablist" :aria-label="t('CONTACT_REASON')">
          <button
            v-for="(item, index) in tabs"
            :id="`contact-tab-${item.id}`"
            :key="item.id"
            type="button"
            role="tab"
            class="contacts__tab"
            :class="{ 'contacts__tab--active': tab === item.id }"
            :aria-selected="tab === item.id"
            :aria-controls="`contact-panel-${tab}`"
            :tabindex="tab === item.id ? 0 : -1"
            @click="tab = item.id"
            @keydown="onTabKey($event, index)"
          >
            {{ t(item.label) }}
          </button>
        </div>

        <div :id="`contact-panel-${tab}`" role="tabpanel" :aria-labelledby="`contact-tab-${tab}`">
          <p class="contacts__hint">{{ tab === 'fitting' ? t('FITTING_FORM_HINT') : t('QUESTION_FORM_HINT') }}</p>
          <!-- a new link (e.g. "Book a fitting" while on this page) starts a fresh form -->
          <ContactForm :key="route.fullPath" :type="tab" :dresses="dress" />
        </div>
      </section>

      <ContactDetails :groups="data ?? []" class="contacts__details" />
    </div>
  </PageLayout>
</template>

<style>
.contacts {
  display: grid;
  gap: 48px;
}
@media (min-width: 960px) {
  .contacts {
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
    align-items: start;
    gap: clamp(48px, 6vw, 96px);
  }
}
.contacts__form {
  padding: clamp(28px, 4vw, 52px);
  border: 1px solid var(--z-line);
  background: var(--z-surface);
}
.contacts__tabs {
  display: flex;
  gap: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--z-line);
}
.contacts__tab {
  margin-bottom: -1px;
  padding: 0 0 14px;
  border-bottom: 1px solid transparent;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--z-muted);
  transition: color 0.2s ease;
}
.contacts__tab:hover {
  color: var(--z-ink);
}
.contacts__tab--active {
  border-bottom-color: var(--z-ink);
  color: var(--z-ink);
}
.contacts__hint {
  margin: 0 0 30px;
  color: var(--z-muted);
}
</style>
