<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="not-found">
    <p>{{ t('NOT_FOUND_TEXT') }}</p>
    <RouterLink :to="localePath('/')" class="btn btn-primary">{{ t('HOME') }}</RouterLink>
  </div>
</template>

<style>
.not-found {
  padding: 24px 0 64px;
  text-align: center;
  color: var(--color-ink-soft);
}
</style>
