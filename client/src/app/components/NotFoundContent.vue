<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

// `temporary`: the API or the network failed, so offer a retry; otherwise the page does not exist.
defineProps<{ temporary?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div class="state-message not-found">
    <p>{{ temporary ? t('LOAD_FAILED') : t('NOT_FOUND_TEXT') }}</p>
    <div class="state-actions">
      <button v-if="temporary" type="button" class="btn btn-outline" @click="$router.go(0)">
        {{ t('TRY_AGAIN') }}
      </button>
      <RouterLink :to="localePath('/collections')" class="btn btn-primary">{{ t('BROWSE_DRESSES') }}</RouterLink>
    </div>
  </div>
</template>
