<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ label: string; items?: { id: string; name: string }[] }>()

const { t } = useI18n()
</script>

<template>
  <div v-if="items">
    <span>{{ t(label) }}</span
    >: &nbsp;
    <span v-for="(item, index) in items" :key="item.id">
      <span>{{ item.name }}</span>
      <span v-if="index < items.length - 1">, </span>
    </span>
  </div>
</template>
