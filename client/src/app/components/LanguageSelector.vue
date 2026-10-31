<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@shared/types'
import uaIcon from '../assets/flags/ua.png'
import ruIcon from '../assets/flags/ru.png'
import roIcon from '../assets/flags/ro.png'
import enIcon from '../assets/flags/en.png'
import { useSwitchLanguage } from '../locale'

const languages: { key: Locale; icon: string; title: string }[] = [
  { key: 'ua', icon: uaIcon, title: 'Українська' },
  { key: 'ru', icon: ruIcon, title: 'Русский' },
  { key: 'ro', icon: roIcon, title: 'Română' },
  { key: 'en', icon: enIcon, title: 'English' },
]

const { locale, t } = useI18n()
const switchLanguage = useSwitchLanguage()

// Desktop opens the list on hover (CSS); the mobile menu has no hover, so a click toggles it as well.
const open = ref(false)
const selected = computed(() => languages.find((language) => language.key === locale.value) ?? languages[0]!)

async function select(language: Locale) {
  open.value = false
  await switchLanguage(language)
}
</script>

<template>
  <div class="language-selector">
    <a
      href="#"
      class="fh5co-sub-ddown"
      role="button"
      aria-haspopup="true"
      :aria-expanded="open"
      :aria-label="t('LANGUAGE')"
      @click.prevent="open = !open"
    >
      <img :src="selected.icon" alt="selected language" />
    </a>
    <ul class="fh5co-sub-menu" :class="{ open }">
      <li v-for="language in languages" :key="language.key">
        <a href="#" :title="language.title" :data-locale="language.key" @click.prevent="select(language.key)">
          <img :src="language.icon" :alt="language.key" />
        </a>
      </li>
    </ul>
  </div>
</template>

<style>
.language-selector a:hover ~ ul,
.language-selector a ~ ul:hover,
.language-selector ul.open {
  display: block;
}
.language-selector ul {
  min-width: 51px;
}
.language-selector img {
  display: inline-block;
  height: 20px;
  width: 20px;
  max-width: none;
}
</style>
