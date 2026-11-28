<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Locale } from '@shared/types'
import { useSwitchLanguage } from '../locale'

// Text codes instead of flags: always visible, nothing to open, readable by screen readers through the full name.
const languages: { key: Locale; code: string; title: string }[] = [
  { key: 'en', code: 'EN', title: 'English' },
  { key: 'ua', code: 'UA', title: 'Українська' },
  { key: 'ro', code: 'RO', title: 'Română' },
  { key: 'ru', code: 'RU', title: 'Русский' },
]

const { locale, t } = useI18n()
const switchLanguage = useSwitchLanguage()
</script>

<template>
  <ul class="language-selector" :aria-label="t('LANGUAGE')">
    <li v-for="language in languages" :key="language.key">
      <a
        href="#"
        :title="language.title"
        :aria-label="language.title"
        :data-locale="language.key"
        :aria-current="language.key === locale ? 'true' : undefined"
        :class="{ active: language.key === locale }"
        @click.prevent="switchLanguage(language.key)"
      >
        {{ language.code }}
      </a>
    </li>
  </ul>
</template>

<style>
.language-selector {
  display: flex;
  gap: 4px;
}
.language-selector a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 44px;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  color: var(--color-ink-soft);
}
.language-selector a:hover {
  color: var(--color-ink);
}
.language-selector a.active {
  color: var(--color-ink);
  text-decoration: underline;
  text-underline-offset: 6px;
}
</style>
