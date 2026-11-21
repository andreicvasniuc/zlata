<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="loading" role="status" :aria-label="t('LOADING')">
    <span class="loading__spinner"></span>
  </div>
</template>
