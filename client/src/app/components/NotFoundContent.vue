<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="not-found" style="text-align: center; padding: 20px 0 40px">
    <p>{{ t('NOT_FOUND_TEXT') }}</p>
    <RouterLink :to="localePath('/')">{{ t('HOME') }}</RouterLink>
  </div>
</template>
