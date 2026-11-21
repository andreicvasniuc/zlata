<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="not-found">
    <p>{{ t('NOT_FOUND_TEXT') }}</p>
    <div class="not-found__actions">
      <RouterLink :to="localePath('/collections')" class="btn">{{ t('BROWSE_COLLECTIONS') }}</RouterLink>
      <RouterLink :to="localePath('/contacts')" class="btn btn--ghost">{{ t('CONTACTS') }}</RouterLink>
    </div>
  </div>
</template>

<style>
.not-found {
  padding: 24px 0 40px;
}
.not-found p {
  font-size: 17px;
  color: var(--z-muted);
}
.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
</style>
