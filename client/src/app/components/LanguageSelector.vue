<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconChevronDown from '~icons/lucide/chevron-down'
import type { Locale } from '@shared/types'
import { useOutsideClick } from '../composables/useOutsideClick'
import { useSwitchLanguage } from '../locale'

// `inline` lists every language at once (mobile drawer); otherwise a button opens the list.
defineProps<{ inline?: boolean }>()

const languages: { key: Locale; title: string; lang: string }[] = [
  { key: 'en', title: 'English', lang: 'en' },
  { key: 'ua', title: 'Українська', lang: 'uk' },
  { key: 'ru', title: 'Русский', lang: 'ru' },
  { key: 'ro', title: 'Română', lang: 'ro' },
]

const { locale, t } = useI18n()
const switchLanguage = useSwitchLanguage()

const open = ref(false)
const root = ref<HTMLElement | null>(null)
const selected = computed(() => languages.find((language) => language.key === locale.value) ?? languages[0]!)

useOutsideClick(root, () => (open.value = false))

async function select(language: Locale) {
  open.value = false
  await switchLanguage(language)
}
</script>

<template>
  <div ref="root" class="language-selector" :class="{ inline }" @keydown.esc="open = false">
    <template v-if="inline">
      <ul :aria-label="t('LANGUAGE')">
        <li v-for="language in languages" :key="language.key">
          <button
            type="button"
            :lang="language.lang"
            :data-locale="language.key"
            :aria-current="language.key === selected.key ? 'true' : undefined"
            @click="select(language.key)"
          >
            {{ language.title }}
          </button>
        </li>
      </ul>
    </template>
    <template v-else>
      <button
        type="button"
        class="language-toggle"
        aria-haspopup="true"
        :aria-expanded="open"
        :aria-label="`${t('LANGUAGE')}: ${selected.title}`"
        @click="open = !open"
      >
        <span aria-hidden="true">{{ selected.title }}</span>
        <IconChevronDown class="size-4" aria-hidden="true" />
      </button>
      <ul v-show="open" class="language-list">
        <li v-for="language in languages" :key="language.key">
          <button
            type="button"
            :lang="language.lang"
            :data-locale="language.key"
            :aria-current="language.key === selected.key ? 'true' : undefined"
            @click="select(language.key)"
          >
            {{ language.title }}
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>

<style>
.language-selector {
  position: relative;
}
.language-selector .language-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
  padding: 0 4px;
  font-size: 0.95rem;
}
.language-selector .language-list {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 110;
  min-width: 160px;
  padding: 6px 0;
  background: var(--color-ivory);
  border: 1px solid var(--color-line);
  box-shadow: 0 8px 24px rgb(42 41 38 / 10%);
}
.language-selector button[data-locale] {
  display: block;
  width: 100%;
  min-height: 44px;
  padding: 0 16px;
  text-align: left;
}
.language-selector button[data-locale]:hover {
  background: var(--color-sand);
}
.language-selector button[aria-current='true'] {
  font-weight: 700;
}
.language-selector.inline ul {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
}
.language-selector.inline button[data-locale] {
  width: auto;
  padding: 0 12px;
  border: 1px solid var(--color-line);
}
.language-selector.inline button[aria-current='true'] {
  border-color: var(--color-ink);
}
</style>
