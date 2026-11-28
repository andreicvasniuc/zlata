<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconPublished from '~icons/lucide/circle-check'
import IconUnpublished from '~icons/lucide/circle-x'
import IconSpinner from '~icons/lucide/loader-circle'

const props = defineProps<{
  published: boolean
  // saves the new state; the spinner shows until it settles
  toggle: (published: boolean) => Promise<void>
}>()

const { t } = useI18n()
const saving = ref(false)

async function click() {
  saving.value = true
  try {
    await props.toggle(!props.published)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <IconSpinner v-if="saving" class="size-5 animate-spin text-ink-soft" data-testid="published-saving" />
  <button
    v-else
    type="button"
    class="cursor-pointer"
    :title="published ? t('UNPUBLISH') : t('PUBLISH')"
    :aria-label="published ? t('UNPUBLISH') : t('PUBLISH')"
    :aria-pressed="published"
    data-testid="published-toggle"
    @click.stop="click"
  >
    <IconPublished v-if="published" class="size-5 text-success" />
    <IconUnpublished v-else class="size-5 text-ink-soft" />
  </button>
</template>
