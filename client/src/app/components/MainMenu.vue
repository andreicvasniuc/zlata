<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import IconChevronDown from '~icons/lucide/chevron-down'
import { collectionsApi } from '@shared/api/resources/public'
import { useLoader } from '../composables/useLoader'
import { useLocalePath } from '../locale'

// Collections (with a panel of all dress collections), Accessories, Contacts. The logo links home.
const open = defineModel<boolean>('open', { default: false })

const LOCALE_PREFIX = /^\/(en|ua|ru|ro)(?=\/|$)/
const FEATURED = 4

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const { data } = useLoader(async () => (await collectionsApi.dresses()).collections ?? [])
const collections = computed(() => data.value ?? [])
const featured = computed(() => collections.value.filter((collection) => collection.image?.url).slice(0, FEATURED))

const currentPath = computed(() => route.path.replace(LOCALE_PREFIX, '') || '/')
const isCollectionsActive = computed(
  () =>
    currentPath.value === '/collections' ||
    collections.value.some(
      (collection) =>
        currentPath.value === `/${collection.slug}` || currentPath.value.startsWith(`/${collection.slug}/`),
    ),
)

// the panel opens on hover with a short delay, so passing the mouse over the menu does not flash it
let timer: ReturnType<typeof setTimeout> | undefined
function show() {
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = true), 80)
}
function hide(delay = 150) {
  clearTimeout(timer)
  timer = setTimeout(() => (open.value = false), delay)
}
function toggle() {
  clearTimeout(timer)
  open.value = !open.value
}
function onFocusOut(event: FocusEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) hide(0)
}
function close() {
  clearTimeout(timer)
  open.value = false
}

watch(() => route.fullPath, close)
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <nav class="main-menu" :aria-label="t('MENU')">
    <ul class="main-menu__list">
      <li
        class="main-menu__item main-menu__item--panel"
        @mouseenter="show"
        @mouseleave="hide()"
        @focusout="onFocusOut"
        @keydown.esc="close"
      >
        <RouterLink
          :to="localePath('/collections')"
          class="main-menu__link"
          :class="{ active: isCollectionsActive }"
          :aria-current="currentPath === '/collections' ? 'page' : undefined"
        >
          {{ t('COLLECTIONS') }}
        </RouterLink>
        <button
          type="button"
          class="main-menu__toggle"
          :aria-expanded="open"
          aria-controls="collections-panel"
          :aria-label="t('SHOW_COLLECTIONS')"
          @click="toggle"
        >
          <IconChevronDown />
        </button>

        <div v-show="open" id="collections-panel" class="collections-panel">
          <div class="collections-panel__inner wrap">
            <ul class="collections-panel__list">
              <li v-for="collection in collections" :key="collection.id">
                <RouterLink :to="localePath(`/${collection.slug}`)" @click="close">{{ collection.name }}</RouterLink>
              </li>
              <li class="collections-panel__all">
                <RouterLink :to="localePath('/collections')" class="text-link" @click="close">
                  {{ t('ALL_COLLECTIONS') }}
                </RouterLink>
              </li>
            </ul>
            <ul class="collections-panel__cards">
              <li v-for="collection in featured" :key="collection.id">
                <RouterLink :to="localePath(`/${collection.slug}`)" tabindex="-1" @click="close">
                  <span class="collections-panel__image">
                    <img :src="collection.image?.url" alt="" loading="lazy" decoding="async" />
                  </span>
                  <span class="collections-panel__name">{{ collection.name }}</span>
                </RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </li>
      <li class="main-menu__item">
        <RouterLink
          :to="localePath('/accessories')"
          class="main-menu__link"
          :class="{ active: currentPath === '/accessories' }"
        >
          {{ t('ACCESSORIES') }}
        </RouterLink>
      </li>
      <li class="main-menu__item">
        <RouterLink
          :to="localePath('/contacts')"
          class="main-menu__link"
          :class="{ active: currentPath === '/contacts' }"
        >
          {{ t('CONTACTS') }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style>
.main-menu__list {
  display: flex;
  align-items: center;
  gap: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.main-menu__item {
  display: flex;
  align-items: center;
}
.main-menu__link {
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: border-color 0.2s ease;
}
.main-menu__link:hover,
.main-menu__link.active {
  border-bottom-color: currentColor;
}
.main-menu__toggle {
  display: grid;
  place-items: center;
  width: 24px;
  height: 32px;
  color: inherit;
}
.main-menu__toggle svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}
.main-menu__toggle[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

.collections-panel {
  position: fixed;
  top: var(--z-header-h);
  left: 0;
  right: 0;
  border-top: 1px solid var(--z-line);
  border-bottom: 1px solid var(--z-line);
  background: var(--z-bg);
  color: var(--z-ink);
  box-shadow: 0 30px 60px -30px rgb(0 0 0 / 0.25);
}
.collections-panel__inner {
  display: grid;
  grid-template-columns: minmax(200px, 260px) 1fr;
  gap: 48px;
  padding-top: 36px;
  padding-bottom: 40px;
}
.collections-panel__list {
  display: grid;
  align-content: start;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}
.collections-panel__list a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.collections-panel__all {
  margin-top: 10px;
}
.collections-panel__cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.collections-panel__image {
  display: block;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  max-height: 340px;
  background: var(--z-soft);
}
.collections-panel__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transition: transform 0.6s ease;
}
.collections-panel__cards a:hover img {
  transform: scale(1.04);
}
.collections-panel__name {
  display: block;
  margin-top: 10px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
</style>
