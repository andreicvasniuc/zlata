<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import headerBackground from '../assets/1-blured.jpg'
import logoBlack from '../assets/logo-black.png'
import logoWhite from '../assets/logo-white.png'
import { useLocalePath } from '../locale'
import { useLayout } from '../stores/layout'
import HeroSlider from './HeroSlider.vue'
import MainMenu from './MainMenu.vue'
import MobileMenu from './MobileMenu.vue'

defineProps<{ heading?: string; isSliderVisible?: boolean }>()

// keeps the heading's height when a page has no title yet
const NBSP = String.fromCharCode(160)

const { t } = useI18n()
const layout = useLayout()
const localePath = useLocalePath()
</script>

<template>
  <MobileMenu v-if="layout.isMobile" />

  <header v-else id="fh5co-header-section" :class="{ 'fh5co-scrolled': layout.isScrolled }" class="gray-menu-links">
    <div class="bs-container">
      <h1 id="fh5co-logo" class="float-left">
        <RouterLink :to="localePath('/')">
          <img v-show="!layout.isScrolled" :src="logoWhite" alt="logo" />
          <img v-show="layout.isScrolled" :src="logoBlack" alt="logo" />
        </RouterLink>
      </h1>
      <MainMenu />
    </div>
  </header>

  <aside v-if="!isSliderVisible" id="fh5co-hero" :style="{ backgroundImage: `url(${headerBackground})` }">
    <div class="bs-container">
      <div class="row">
        <div class="col-md-8 col-md-offset-2">
          <div class="fh5co-hero-wrap">
            <div class="fh5co-hero-intro" :style="{ opacity: layout.headingOpacity }">
              <h2>{{ t('HEADER') }}<span></span></h2>
              <h1>{{ heading || NBSP }}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  </aside>

  <HeroSlider v-else />
</template>

<style>
#fh5co-logo {
  font-size: 20px;
  margin: -40px 0 0 -20px;
  padding: 0;
  font-weight: bold;
}
#fh5co-logo a {
  display: inline-block;
  border-bottom: none !important;
  color: #fff;
  letter-spacing: 3px;
  text-transform: uppercase;
}
#fh5co-logo a img {
  width: 150px;
  max-width: none;
}
.fh5co-scrolled #fh5co-logo img {
  position: relative;
  top: 26px;
  width: 100px;
}
</style>
