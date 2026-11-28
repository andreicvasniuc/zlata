<script setup lang="ts">
import { computed } from 'vue'
import Select from 'primevue/select'
import { currentLocale } from '@shared/api'
import type { Locale } from '@shared/types'
import { useSetLocale } from '../composables/useLocale'
import en from '../assets/flags/en.png'
import ro from '../assets/flags/ro.png'
import ru from '../assets/flags/ru.png'
import ua from '../assets/flags/ua.png'

const languages: { key: Locale; icon: string; title: string }[] = [
  { key: 'ua', icon: ua, title: 'Українська' },
  { key: 'ru', icon: ru, title: 'Русский' },
  { key: 'ro', icon: ro, title: 'Română' },
  { key: 'en', icon: en, title: 'English' },
]

const setLocale = useSetLocale()
const selected = computed({
  get: () => currentLocale.value,
  set: (locale: Locale) => void setLocale(locale),
})
</script>

<template>
  <Select
    v-model="selected"
    :options="languages"
    option-label="key"
    option-value="key"
    class="w-28"
    data-testid="language-selector"
  >
    <template #value="{ value }">
      <span v-if="value" class="flex items-center gap-2">
        <img :src="languages.find((language) => language.key === value)?.icon" :alt="value" class="h-4" />
        {{ value }}
      </span>
    </template>
    <template #option="{ option }">
      <span class="flex items-center gap-2" :title="option.title">
        <img :src="option.icon" :alt="option.key" class="h-4" />
        {{ option.key }}
      </span>
    </template>
  </Select>
</template>
