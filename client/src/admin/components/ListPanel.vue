<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconSearch from '~icons/lucide/search'
import IconClear from '~icons/lucide/scissors'

defineProps<{
  // i18n keys
  searchPlaceholder?: string
  addLabel: string
}>()

const searchInput = defineModel<string>('searchInput', { required: true })
const emit = defineEmits<{ search: []; clear: []; add: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="mb-6 border border-border bg-white">
    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
      <div class="relative flex w-64 items-center">
        <input
          v-model="searchInput"
          type="text"
          class="w-full border border-border bg-white py-1.5 pr-14 pl-3 text-sm"
          :placeholder="t(searchPlaceholder ?? 'SEARCH')"
          data-testid="search-input"
          @keydown.enter="emit('search')"
        />
        <button
          v-if="searchInput"
          type="button"
          class="absolute right-8 cursor-pointer"
          title="cut"
          data-testid="search-clear"
          @click="emit('clear')"
        >
          <IconClear class="size-4 text-ink-soft" />
        </button>
        <button
          type="button"
          class="absolute right-0 flex h-full w-8 cursor-pointer items-center justify-center border-l border-border"
          :aria-label="t('SEARCH')"
          data-testid="search-button"
          @click="emit('search')"
        >
          <IconSearch class="size-4" />
        </button>
      </div>
      <button
        type="button"
        class="cursor-pointer border border-border bg-white px-4 py-1.5 text-sm hover:bg-surface"
        data-testid="add"
        @click="emit('add')"
      >
        {{ t(addLabel) }}
      </button>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
