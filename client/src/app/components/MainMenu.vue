<script setup lang="ts">
import IconChevronDown from '~icons/lucide/chevron-down'
import { useMenu } from '../composables/useMenu'
import { useLocalePath } from '../locale'
import LanguageSelector from './LanguageSelector.vue'

const { menu, isActive } = useMenu()
const localePath = useLocalePath()
</script>

<template>
  <nav id="fh5co-menu-wrap" role="navigation">
    <ul id="fh5co-primary-menu" class="sf-menu">
      <li v-for="item in menu" :key="item.url + item.name" :class="{ active: isActive(item) }">
        <RouterLink
          :to="localePath(item.url)"
          :class="{ 'fh5co-sub-ddown sf-with-ul': !!item.list }"
          :title="item.name"
        >
          {{ item.name }}
          <IconChevronDown v-if="item.list" class="sf-arrow" />
        </RouterLink>
        <ul v-if="item.list" class="fh5co-sub-menu">
          <li v-for="subItem in item.list" :key="subItem.url">
            <RouterLink :to="localePath(subItem.url)" :title="subItem.name">{{ subItem.name }}</RouterLink>
          </li>
        </ul>
      </li>
      <li>
        <LanguageSelector />
      </li>
    </ul>
  </nav>
</template>

<style>
/* Superfish-style menu without the plugin: sub menus open on hover */
#fh5co-menu-wrap .sf-menu,
#fh5co-menu-wrap .sf-menu * {
  margin: 0;
  padding: 0;
  list-style: none;
}
#fh5co-menu-wrap .sf-menu {
  float: right;
}
#fh5co-menu-wrap .sf-menu li {
  position: relative;
  background: transparent;
  white-space: nowrap;
}
#fh5co-menu-wrap .sf-menu > li {
  float: left;
}
#fh5co-menu-wrap .sf-menu a {
  display: block;
  position: relative;
  padding: 2em;
  color: var(--color-ink);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
  border-bottom: none !important;
}
#fh5co-menu-wrap .sf-menu a:hover {
  color: #000;
}
#fh5co-menu-wrap .sf-menu .sf-with-ul {
  padding-right: 2.5em;
}
#fh5co-menu-wrap .sf-menu .sf-arrow {
  position: absolute;
  right: 1.1em;
  top: 50%;
  margin-top: -7px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
}

#fh5co-menu-wrap .sf-menu ul {
  position: absolute;
  display: none;
  top: 100%;
  right: 0;
  z-index: 99;
  min-width: 8em;
  padding: 7px 0 3px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
}
#fh5co-menu-wrap .sf-menu li:hover > ul,
#fh5co-menu-wrap .language-selector a:hover ~ ul,
#fh5co-menu-wrap .language-selector ul:hover,
#fh5co-menu-wrap .language-selector ul.open {
  display: block;
}
#fh5co-menu-wrap .language-selector ul {
  min-width: 51px;
}
#fh5co-menu-wrap .sf-menu ul::after {
  position: absolute;
  top: -8px;
  right: 21px;
  width: 0;
  height: 0;
  border-right: 8px solid transparent;
  border-bottom: 8px solid rgba(0, 0, 0, 0.8);
  border-left: 8px solid transparent;
  content: '';
}
#fh5co-menu-wrap .sf-menu ul a {
  letter-spacing: 0;
  padding: 0 15px;
  font-size: 14px;
  line-height: 26px;
  color: #fff !important;
  text-transform: none;
}
#fh5co-menu-wrap .sf-menu ul a:hover {
  color: var(--color-accent) !important;
}

/* once the header is white: the active item and hovered items turn blue */
#fh5co-header-section.fh5co-scrolled #fh5co-menu-wrap .sf-menu > li > a:hover {
  color: var(--color-accent) !important;
}
#fh5co-header-section.fh5co-scrolled #fh5co-menu-wrap .sf-menu > li.active > a {
  color: var(--color-accent) !important;
}
</style>
