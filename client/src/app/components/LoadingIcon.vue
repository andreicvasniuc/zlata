<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="loading-icon" role="status" :aria-label="t('LOADING')"><span></span></div>
</template>

<style>
.loading-icon {
  display: flex;
  justify-content: center;
  padding: 64px 0;
}
.loading-icon span {
  width: 32px;
  height: 32px;
  border: 2px solid var(--color-line);
  border-top-color: var(--color-ink);
  border-radius: 50%;
  animation: loading-spin 0.9s linear infinite;
}
@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
