<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactGroupsApi } from '@shared/api/resources/public'
import ContactForm from '../components/ContactForm.vue'
import ContactGroups from '../components/ContactGroups.vue'
import PageLayout from '../components/PageLayout.vue'
import { useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'

const { t } = useI18n()
const title = computed(() => t('CONTACTS'))
usePageTitle(title)

const { data, loading } = useLoader(async () => (await contactGroupsApi.list()).contact_groups ?? [])
</script>

<template>
  <PageLayout :heading="title" :breadcrumb="[{ name: title }]" :loading="loading">
    <div class="contacts-layout">
      <div class="contacts-info">
        <p class="eyebrow">{{ t('CONTACT_EYEBROW') }}</p>
        <p class="contacts-intro">{{ t('CONTACT_INTRO') }}</p>
        <ContactGroups :list="data ?? []" />
      </div>

      <div class="contacts-form">
        <ContactForm />
      </div>
    </div>
  </PageLayout>
</template>

<style>
.contacts-layout {
  display: grid;
  gap: 40px;
}
.contacts-intro {
  margin-bottom: 28px;
  font-size: 1.05rem;
  color: var(--color-ink-soft);
}
.contacts-form {
  padding: 28px 24px;
  background: #fff;
  border: 1px solid var(--color-border);
}
@media (min-width: 992px) {
  .contacts-layout {
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 64px;
    align-items: start;
  }
  .contacts-form {
    padding: 40px 48px;
  }
}
</style>
