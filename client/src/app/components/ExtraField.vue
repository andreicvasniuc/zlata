<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ label: string; items?: { id: string; name: string }[] }>()

const { t } = useI18n()
</script>

<template>
  <div v-if="items?.length" class="extra-field">
    <span class="field-label">{{ t(label) }}</span>
    <ul class="chips">
      <li v-for="item in items" :key="item.id" class="chip">{{ item.name }}</li>
    </ul>
  </div>
</template>

<style>
.extra-field {
  margin-bottom: 24px;
}
.extra-field .field-label {
  margin-bottom: 10px;
}
.extra-field .chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
