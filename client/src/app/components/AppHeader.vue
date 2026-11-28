<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import logo from '../assets/logo-black.png'
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
    <div class="site-header-bar">
      <div class="site-header-mobile">
        <MobileMenu />
      </div>

      <RouterLink :to="localePath('/')" class="site-logo">
        <img :src="logo" :alt="t('LONG_SITE_NAME')" width="64" height="64" />
      </RouterLink>

      <div class="site-header-desktop site-header-nav">
        <MainMenu />
      </div>
      <div class="site-header-desktop site-header-actions">
        <LanguageSelector />
        <RouterLink :to="localePath('/contacts')" class="btn btn-outline book-fitting">{{
          t('BOOK_FITTING')
        }}</RouterLink>
      </div>
    </div>
  </header>
</template>

<style>
/* one sticky bar for every scroll position: no jump of the logo, readable on any page */
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgb(250 248 245 / 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}
.site-header-bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 64px;
  max-width: var(--site-width);
  margin: 0 auto;
  padding: 0 var(--site-gutter);
  box-sizing: border-box;
}
.site-logo {
  display: inline-flex;
  align-items: center;
}
.site-logo img {
  display: block;
  width: auto;
  height: 48px;
  /* the emblem comes on a white background: multiply lets the header colour show through */
  mix-blend-mode: multiply;
}
.site-header-desktop {
  display: none;
}

@media (min-width: 992px) {
  .site-header-bar {
    grid-template-columns: auto 1fr auto;
    gap: 32px;
    height: var(--site-header-height);
  }
  .site-header-mobile {
    display: none;
  }
  .site-header-desktop {
    display: flex;
  }
  .site-header-nav {
    justify-content: center;
  }
  .site-header-actions {
    align-items: center;
    gap: 28px;
  }
  .site-logo img {
    height: 60px;
  }
  .book-fitting {
    min-height: 46px;
    padding: 0 24px;
    border-color: var(--color-ink);
    background: transparent;
  }
  .book-fitting:hover {
    background: var(--color-ink);
    color: #fff;
  }
}
</style>
