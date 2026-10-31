<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconMenu from '~icons/lucide/menu'
import logoBlackText from '../assets/logo-black-text.png'
import { useMenu, type MenuItem } from '../composables/useMenu'
import { useOutsideClick } from '../composables/useOutsideClick'
import { useLocalePath } from '../locale'
import { useLayout } from '../stores/layout'
import LanguageSelector from './LanguageSelector.vue'

const { t } = useI18n()
const layout = useLayout()
const { menu, isActive } = useMenu()
const localePath = useLocalePath()

const menuElement = ref<HTMLElement | null>(null)
useOutsideClick(menuElement, () => layout.hideMobileMenu(), '#fh5co-mobile-menu-btn')

// items with a sub menu expand instead of navigating
const expanded = reactive<Record<string, boolean>>({})
function onItemClick(event: Event, item: MenuItem) {
  if (!item.list) return
  event.preventDefault()
  expanded[item.name] = !expanded[item.name]
}
</script>

<template>
  <div id="fh5co-logo-mobile-wrap">
    <h1 id="fh5co-logo-mobile">
      <RouterLink :to="localePath('/')">
        <img :src="logoBlackText" alt="logo" />
      </RouterLink>
    </h1>
    <button
      id="fh5co-mobile-menu-btn"
      type="button"
      :aria-label="t('MENU')"
      :aria-expanded="layout.isMobileMenuVisible"
      @click="layout.toggleMobileMenu()"
    >
      <IconMenu />
    </button>
  </div>

  <div id="fh5co-mobile-menu" ref="menuElement">
    <ul id="fh5co-mobile-menu-ul">
      <li v-for="item in menu" :key="item.url + item.name" :class="{ active: isActive(item) }">
        <RouterLink
          :to="localePath(item.url)"
          :class="{ 'fh5co-sub-ddown sf-with-ul': !!item.list }"
          @click.capture="onItemClick($event, item)"
        >
          {{ item.name }}
        </RouterLink>
        <ul v-if="item.list" class="fh5co-sub-menu" :class="{ open: expanded[item.name] }">
          <li v-for="subItem in item.list" :key="subItem.url">
            <RouterLink :to="localePath(subItem.url)">{{ subItem.name }}</RouterLink>
          </li>
        </ul>
      </li>
      <li>
        <LanguageSelector />
      </li>
    </ul>
  </div>
</template>

<style>
#fh5co-mobile-menu-btn {
  padding: 0 10px;
  z-index: 1001;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--color-accent);
  height: 44px;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 22px;
}

#fh5co-mobile-menu {
  transform: translateX(-275px);
  transition: all 0.3s ease;
  display: block;
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: fixed;
  top: 0;
  width: 275px;
  z-index: 10002;
  background: #181920;
  padding: 0.75em 1.25em;
}
body.fh5co-mobile-menu-visible #fh5co-mobile-menu {
  transform: translateX(0);
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul,
#fh5co-mobile-menu #fh5co-mobile-menu-ul ul {
  padding: 0;
  margin: 0;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul li {
  list-style: none;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul li.active > a {
  color: #fff;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul a {
  border-bottom: none !important;
  padding: 7px 0;
  display: block;
  color: rgba(255, 255, 255, 0.5);
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul a:hover {
  color: #fff;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul .fh5co-sub-ddown {
  position: relative;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul .fh5co-sub-ddown::after {
  position: absolute;
  right: 0;
  top: 50%;
  width: 20px;
  height: 20px;
  margin-top: -10px;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-opacity='.5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
    center / contain no-repeat;
  content: '';
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul .fh5co-sub-menu {
  display: none;
  padding-left: 20px;
}
#fh5co-mobile-menu #fh5co-mobile-menu-ul .fh5co-sub-menu.open {
  display: block;
}

#fh5co-logo-mobile-wrap {
  transition: all 0.3s ease;
  display: block;
  height: 44px;
  left: 0;
  position: fixed;
  text-align: center;
  top: 0;
  width: 100%;
  z-index: 10001;
  background: #fff;
  color: var(--color-ink);
  box-shadow: 0 0.125em 0.125em 0 rgba(0, 0, 0, 0.125);
}
#fh5co-logo-mobile-wrap h1 {
  padding: 0;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}
#fh5co-logo-mobile-wrap h1 a {
  display: inline-block;
  border-bottom: none !important;
}
#fh5co-logo-mobile img {
  width: 100px;
}
</style>
