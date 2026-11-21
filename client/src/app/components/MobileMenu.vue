<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconChevronDown from '~icons/lucide/chevron-down'
import { collectionsApi } from '@shared/api/resources/public'
import { contactsQuery } from '../contacts'
import { useLoader } from '../composables/useLoader'
import { useLocalePath } from '../locale'
import { useFavourites } from '../stores/favourites'
import { useLayout } from '../stores/layout'
import LanguageSelector from './LanguageSelector.vue'
import SocialLinks from './SocialLinks.vue'

// The full-screen menu of phones and tablets, opened by the header's menu button.
const { t } = useI18n()
const layout = useLayout()
const favourites = useFavourites()
const localePath = useLocalePath()

const { data } = useLoader(async () => (await collectionsApi.dresses()).collections ?? [])
const collections = computed(() => data.value ?? [])

const panel = ref<HTMLElement | null>(null)
const isCollectionsOpen = ref(false)

watch(
  () => layout.isMobileMenuVisible,
  async (visible) => {
    if (!visible) {
      isCollectionsOpen.value = false
      return
    }
    await nextTick()
    panel.value?.querySelector<HTMLElement>('a, button')?.focus()
  },
)

function close() {
  layout.hideMobileMenu()
  document.getElementById('mobile-menu-button')?.focus()
}
</script>

<template>
  <Transition name="mobile-menu">
    <div v-if="layout.isMobileMenuVisible" id="mobile-menu" ref="panel" class="mobile-menu" @keydown.esc="close">
      <nav class="mobile-menu__nav" :aria-label="t('MENU')">
        <ul class="mobile-menu__list">
          <li>
            <button
              type="button"
              class="mobile-menu__link"
              :aria-expanded="isCollectionsOpen"
              aria-controls="mobile-menu-collections"
              @click="isCollectionsOpen = !isCollectionsOpen"
            >
              {{ t('COLLECTIONS') }}
              <IconChevronDown class="mobile-menu__chevron" />
            </button>
            <ul v-show="isCollectionsOpen" id="mobile-menu-collections" class="mobile-menu__sub">
              <li v-for="collection in collections" :key="collection.id">
                <RouterLink :to="localePath(`/${collection.slug}`)" @click="layout.hideMobileMenu()">
                  {{ collection.name }}
                </RouterLink>
              </li>
              <li>
                <RouterLink :to="localePath('/collections')" class="text-link" @click="layout.hideMobileMenu()">
                  {{ t('ALL_COLLECTIONS') }}
                </RouterLink>
              </li>
            </ul>
          </li>
          <li>
            <RouterLink :to="localePath('/accessories')" class="mobile-menu__link" @click="layout.hideMobileMenu()">
              {{ t('ACCESSORIES') }}
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="localePath('/contacts')" class="mobile-menu__link" @click="layout.hideMobileMenu()">
              {{ t('CONTACTS') }}
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="localePath('/favourites')" class="mobile-menu__link" @click="layout.hideMobileMenu()">
              {{ t('FAVOURITES') }}
              <span v-if="favourites.count" class="mobile-menu__count">{{ favourites.count }}</span>
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="mobile-menu__footer">
        <LanguageSelector variant="inline" />
        <RouterLink
          class="btn btn--block"
          :to="{ path: localePath('/contacts'), query: contactsQuery('fitting') }"
          @click="layout.hideMobileMenu()"
        >
          {{ t('BOOK_FITTING') }}
        </RouterLink>
        <SocialLinks />
      </div>
    </div>
  </Transition>
</template>

<style>
.mobile-menu {
  position: fixed;
  top: var(--z-header-h);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--z-bg);
}
@media (min-width: 1024px) {
  .mobile-menu {
    display: none;
  }
}
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-menu__nav {
  flex: 1;
  padding: 8px var(--z-gutter) 24px;
}
.mobile-menu__list,
.mobile-menu__sub {
  margin: 0;
  padding: 0;
  list-style: none;
}
.mobile-menu__list > li {
  border-bottom: 1px solid var(--z-line);
}
.mobile-menu__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px 0;
  font-family: var(--z-serif);
  font-size: 32px;
  line-height: 1.1;
  text-align: left;
  color: inherit;
}
.mobile-menu__chevron {
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}
[aria-expanded='true'] > .mobile-menu__chevron {
  transform: rotate(180deg);
}
.mobile-menu__sub {
  display: grid;
  gap: 14px;
  padding: 0 0 22px 2px;
  font-size: 15px;
}
.mobile-menu__count {
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 7px;
  border-radius: 13px;
  background: var(--z-ink);
  color: var(--z-bg);
  font-family: var(--z-sans);
  font-size: 12px;
}
.mobile-menu__footer {
  display: grid;
  gap: 18px;
  padding: 20px var(--z-gutter) 32px;
  border-top: 1px solid var(--z-line);
}
</style>
