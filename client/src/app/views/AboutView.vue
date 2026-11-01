<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PageLayout from '../components/PageLayout.vue'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const localePath = useLocalePath()
const title = computed(() => t('ABOUT'))
usePageTitle(title)
</script>

<template>
  <PageLayout :heading="title" :breadcrumb="[{ name: title }]">
    <div class="about-text">
      <p>{{ t('ABOUT_TEXT_1') }}</p>
      <p>{{ t('ABOUT_TEXT_2') }}</p>
      <div class="state-actions about-actions">
        <RouterLink :to="localePath('/collections')" class="btn btn-primary">{{ t('HOME_CTA_PRIMARY') }}</RouterLink>
        <RouterLink :to="localePath('/contacts')" class="btn btn-outline">{{ t('CONTACTS') }}</RouterLink>
      </div>
    </div>
  </PageLayout>
</template>

<style>
.about-text {
  max-width: 640px;
  font-size: 1.1rem;
  color: var(--color-ink-soft);
}
.about-actions {
  justify-content: flex-start;
  margin-top: 32px;
}
</style>
