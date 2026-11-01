<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import logo from '../assets/logo-black-text.png'
import { useLocalePath } from '../locale'
import LanguageSelector from './LanguageSelector.vue'
import MainMenu from './MainMenu.vue'
import MobileMenu from './MobileMenu.vue'

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <a href="#main" class="skip-link">{{ t('SKIP_TO_CONTENT') }}</a>

  <header class="site-header">
    <div class="site-container site-header-bar">
      <div class="site-header-mobile">
        <MobileMenu />
      </div>

      <RouterLink :to="localePath('/')" class="site-logo">
        <img :src="logo" :alt="t('LONG_SITE_NAME')" width="150" height="68" />
      </RouterLink>

      <div class="site-header-desktop site-header-nav">
        <MainMenu />
      </div>
      <div class="site-header-desktop">
        <LanguageSelector />
      </div>
    </div>
  </header>
</template>

<style>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-ivory);
  border-bottom: 1px solid var(--color-line);
}
.site-header-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: var(--site-header-height);
}
.site-logo {
  display: inline-flex;
  align-items: center;
}
.site-logo img {
  display: block;
  width: auto;
  height: 52px;
  /* the wordmark has a white background: multiply lets the ivory header show through */
  mix-blend-mode: multiply;
}
.site-header-desktop {
  display: none;
}

@media (min-width: 769px) {
  .site-header-bar {
    grid-template-columns: auto 1fr auto;
    gap: 32px;
  }
  .site-header-mobile {
    display: none;
  }
  .site-header-desktop {
    display: block;
  }
  .site-header-nav {
    justify-self: center;
  }
  .site-logo img {
    height: 56px;
  }
}
</style>
