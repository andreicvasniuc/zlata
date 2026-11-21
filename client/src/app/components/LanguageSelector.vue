<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IconChevronDown from '~icons/lucide/chevron-down'
import type { Locale } from '@shared/types'
import { useOutsideClick } from '../composables/useOutsideClick'
import { useSwitchLanguage } from '../locale'

// `dropdown` in the desktop header, `inline` (all four codes in a row) in the mobile menu and the footer.
withDefaults(defineProps<{ variant?: 'dropdown' | 'inline' }>(), { variant: 'dropdown' })

const languages: { key: Locale; title: string }[] = [
  { key: 'ua', title: 'Українська' },
  { key: 'en', title: 'English' },
  { key: 'ro', title: 'Română' },
  { key: 'ru', title: 'Русский' },
]

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/

const { locale, t } = useI18n()
const route = useRoute()
const switchLanguage = useSwitchLanguage()

const root = ref<HTMLElement | null>(null)
const open = ref(false)
useOutsideClick(root, () => (open.value = false))

const current = computed(() => languages.find((language) => language.key === locale.value) ?? languages[0]!)

// real links, so the other languages can be opened in a new tab and are visible to crawlers
const hrefFor = (key: Locale) => {
  const rest = route.path.replace(LOCALE_PREFIX, '')
  return `/${key}${rest === '/' ? '' : rest}`
}

async function select(key: Locale) {
  open.value = false
  await switchLanguage(key)
}
</script>

<template>
  <div ref="root" class="language-selector" :class="`language-selector--${variant}`" @keydown.esc="open = false">
    <template v-if="variant === 'dropdown'">
      <button
        type="button"
        class="language-selector__toggle"
        aria-haspopup="true"
        :aria-expanded="open"
        :aria-label="`${t('LANGUAGE')}: ${current.title}`"
        @click="open = !open"
      >
        {{ current.key.toUpperCase() }}
        <IconChevronDown />
      </button>
      <ul v-show="open" class="language-selector__menu">
        <li v-for="language in languages" :key="language.key">
          <a
            :href="hrefFor(language.key)"
            :hreflang="language.key === 'ua' ? 'uk' : language.key"
            :data-locale="language.key"
            :aria-current="language.key === current.key ? 'true' : undefined"
            @click.prevent="select(language.key)"
          >
            <span class="language-selector__code">{{ language.key.toUpperCase() }}</span>
            {{ language.title }}
          </a>
        </li>
      </ul>
    </template>

    <ul v-else class="language-selector__inline" :aria-label="t('LANGUAGE')">
      <li v-for="language in languages" :key="language.key">
        <a
          :href="hrefFor(language.key)"
          :title="language.title"
          :aria-label="language.title"
          :hreflang="language.key === 'ua' ? 'uk' : language.key"
          :data-locale="language.key"
          :aria-current="language.key === current.key ? 'true' : undefined"
          @click.prevent="select(language.key)"
        >
          {{ language.key.toUpperCase() }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style>
.language-selector {
  position: relative;
}
.language-selector__toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 0 4px;
  color: inherit;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
}
.language-selector__toggle svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}
.language-selector__toggle[aria-expanded='true'] svg {
  transform: rotate(180deg);
}
.language-selector__menu {
  position: absolute;
  top: calc(100% + 10px);
  right: -12px;
  z-index: 10;
  min-width: 190px;
  margin: 0;
  padding: 8px 0;
  list-style: none;
  border: 1px solid var(--z-line);
  background: var(--z-bg);
  color: var(--z-ink);
  box-shadow: 0 20px 40px -24px rgb(0 0 0 / 0.35);
}
.language-selector__menu a {
  display: flex;
  gap: 14px;
  padding: 9px 18px;
  font-size: 14px;
}
.language-selector__menu a:hover,
.language-selector__menu a[aria-current='true'] {
  background: var(--z-soft);
}
.language-selector__code {
  width: 22px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 21px;
}

.language-selector__inline {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--z-line);
}
.language-selector__inline li + li {
  border-left: 1px solid var(--z-line);
}
.language-selector__inline a {
  display: block;
  padding: 11px 0;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-align: center;
}
.language-selector__inline a[aria-current='true'] {
  background: var(--z-ink);
  color: var(--z-bg);
}
</style>
