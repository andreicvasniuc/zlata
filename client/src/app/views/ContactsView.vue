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
  <PageLayout :heading="title" :breadcrumb="[{ name: title }]" :loading="loading" centered>
    <div class="col-md-6">
      <ContactForm />
    </div>

    <div class="col-md-6">
      <ContactGroups :list="data ?? []" />
    </div>
  </PageLayout>
</template>
