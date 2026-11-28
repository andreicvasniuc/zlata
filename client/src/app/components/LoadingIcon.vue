<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="uil-ripple-css" style="transform: scale(0.51)" role="status" :aria-label="t('LOADING')">
    <div></div>
    <div></div>
  </div>
</template>
