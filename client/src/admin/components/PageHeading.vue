<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  // i18n key of the page title
  title: string
  // optional "<Parent kind> <b>name</b>:" in front of the title, e.g. the collection whose products are listed
  parentKind?: string
  parentName?: string
}>()

const { t } = useI18n()
</script>

<template>
  <h1 class="mt-6 mb-6 border-b border-border pb-3 text-3xl font-normal">
    <span v-if="parentKind && parentName" data-testid="parent-heading"
      >{{ t(parentKind) }} <b>{{ parentName }}</b
      >:</span
    >
    {{ t(title) }}
  </h1>
</template>
