<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconMenu from '~icons/lucide/menu'
import IconClose from '~icons/lucide/x'
import logo from '../assets/logo-wordmark.png'
import { contactsQuery } from '../contacts'
import { useLocalePath } from '../locale'
import { useLayout } from '../stores/layout'
import ChatLink from './ChatLink.vue'
import FavouritesLink from './FavouritesLink.vue'
import LanguageSelector from './LanguageSelector.vue'
import MainMenu from './MainMenu.vue'
import MobileMenu from './MobileMenu.vue'

// `overlay`: the header starts transparent over the home page slider and turns solid once the page scrolls.
const props = defineProps<{ overlay?: boolean }>()

const { t } = useI18n()
const layout = useLayout()
const localePath = useLocalePath()

const isCollectionsMenuOpen = ref(false)
const isTransparent = computed(
  () => props.overlay && !layout.isScrolled && !layout.isMobileMenuVisible && !isCollectionsMenuOpen.value,
)
</script>

<template>
  <a class="skip-link" href="#main">{{ t('SKIP_TO_CONTENT') }}</a>

  <header
    id="site-header"
    class="site-header"
    :class="{ 'site-header--transparent': isTransparent, 'site-header--raised': layout.isScrolled }"
  >
    <div class="site-header__bar">
      <button
        id="mobile-menu-button"
        type="button"
        class="icon-button site-header__burger"
        :aria-label="layout.isMobileMenuVisible ? t('CLOSE') : t('MENU')"
        :aria-expanded="layout.isMobileMenuVisible"
        aria-controls="mobile-menu"
        @click="layout.toggleMobileMenu()"
      >
        <IconClose v-if="layout.isMobileMenuVisible" />
        <IconMenu v-else />
      </button>

      <RouterLink class="site-header__logo" :to="localePath('/')">
        <img :src="logo" :alt="t('LONG_SITE_NAME')" width="640" height="226" />
      </RouterLink>

      <MainMenu v-model:open="isCollectionsMenuOpen" class="site-header__nav" />

      <div class="site-header__actions">
        <ChatLink />
        <LanguageSelector class="site-header__lang" />
        <FavouritesLink />
        <RouterLink
          class="btn btn--sm site-header__cta"
          :to="{ path: localePath('/contacts'), query: contactsQuery('fitting') }"
        >
          {{ t('BOOK_FITTING_SHORT') }}
        </RouterLink>
      </div>
    </div>
  </header>

  <MobileMenu />
</template>

<style>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--z-header-h);
  border-bottom: 1px solid var(--z-line);
  background: var(--z-bg);
  color: var(--z-ink);
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease,
    box-shadow 0.3s ease;
}
.site-header--raised {
  box-shadow: 0 10px 30px -24px rgb(0 0 0 / 0.45);
}
.site-header--transparent {
  border-color: rgb(255 255 255 / 0.22);
  background: transparent;
  box-shadow: none;
  color: #fff;
}
/* keeps the white links readable over light photos */
.site-header--transparent::before {
  content: '';
  position: absolute;
  inset: 0 0 -48px;
  z-index: -1;
  background: linear-gradient(rgb(20 18 16 / 0.38), rgb(20 18 16 / 0));
  pointer-events: none;
}

.site-header__bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 100%;
  max-width: var(--z-max);
  margin: 0 auto;
  padding: 0 max(6px, calc(var(--z-gutter) - 12px));
}
.site-header__logo {
  justify-self: center;
  display: block;
}
.site-header__logo img {
  width: auto;
  height: 30px;
}
.site-header--transparent .site-header__logo img {
  filter: invert(1);
}
.site-header__actions {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 4px;
}
@media (min-width: 1024px) {
  .site-header__actions {
    gap: 16px;
  }
}
.site-header__nav,
.site-header__lang,
.site-header__cta {
  display: none !important;
}

@media (min-width: 1024px) {
  .site-header__bar {
    grid-template-columns: auto 1fr auto;
    gap: 28px;
    padding: 0 var(--z-gutter);
  }
  .site-header__burger {
    display: none;
  }
  .site-header__logo {
    justify-self: start;
  }
  .site-header__logo img {
    height: 40px;
  }
  .site-header__nav {
    display: flex !important;
    justify-self: center;
  }
  .site-header__lang {
    display: block !important;
  }
  .site-header__cta {
    display: inline-flex !important;
  }
  .site-header--transparent .site-header__cta {
    border-color: #fff;
    background: #fff;
    color: var(--z-ink);
  }
}
</style>
