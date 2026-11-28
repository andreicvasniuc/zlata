<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconMenu from '~icons/lucide/menu'
import IconClose from '~icons/lucide/x'
import { useMenu } from '../composables/useMenu'
import { useLocalePath } from '../locale'
import { useLayout } from '../stores/layout'
import LanguageSelector from './LanguageSelector.vue'

const { t } = useI18n()
const layout = useLayout()
const { menu, isActive } = useMenu()
const localePath = useLocalePath()

const toggleButton = ref<HTMLButtonElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const drawer = ref<HTMLElement | null>(null)

// A destination was chosen: the page takes the focus, so it must not go back to the menu button.
let closedByNavigation = false

watch(
  () => layout.isMobileMenuVisible,
  async (visible) => {
    if (visible) {
      closedByNavigation = false
      await nextTick()
      closeButton.value?.focus()
    } else if (!closedByNavigation) {
      toggleButton.value?.focus()
    }
  },
)

function onDrawerClick(event: MouseEvent) {
  if ((event.target as Element).closest('a')) {
    closedByNavigation = true
    layout.hideMobileMenu()
  }
}

const FOCUSABLE = 'a[href], button:not([disabled])'

// Keeps Tab inside the open drawer; Escape closes it.
function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    layout.hideMobileMenu()
    return
  }
  if (event.key !== 'Tab' || !drawer.value) return
  const items = [...drawer.value.querySelectorAll<HTMLElement>(FOCUSABLE)]
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

// The drawer belongs to narrow windows only: leaving them closes it.
const wide = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(min-width: 992px)') : undefined
const onWide = () => {
  if (wide?.matches) layout.hideMobileMenu()
}
onMounted(() => wide?.addEventListener('change', onWide))
onBeforeUnmount(() => wide?.removeEventListener('change', onWide))
</script>

<template>
  <button
    ref="toggleButton"
    type="button"
    class="menu-button"
    aria-controls="mobile-menu"
    :aria-expanded="layout.isMobileMenuVisible"
    :aria-label="t('MENU')"
    @click="layout.toggleMobileMenu()"
  >
    <IconMenu class="size-6" aria-hidden="true" />
  </button>

  <!-- teleported: the sticky header has a backdrop filter, which would trap fixed children inside the bar -->
  <Teleport to="body">
    <div v-if="layout.isMobileMenuVisible" class="drawer-backdrop" @click="layout.hideMobileMenu()"></div>
    <div
      id="mobile-menu"
      ref="drawer"
      class="drawer"
      :class="{ open: layout.isMobileMenuVisible }"
      role="dialog"
      aria-modal="true"
      :aria-label="t('MENU')"
      :hidden="!layout.isMobileMenuVisible"
      @keydown="onKeydown"
      @click="onDrawerClick"
    >
      <div class="drawer-head">
        <span class="eyebrow">{{ t('MENU') }}</span>
        <button
          ref="closeButton"
          type="button"
          class="drawer-close"
          :aria-label="t('CLOSE')"
          @click="layout.hideMobileMenu()"
        >
          <IconClose class="size-6" aria-hidden="true" />
        </button>
      </div>

      <nav :aria-label="t('MAIN_MENU')">
        <ul class="drawer-links">
          <li v-for="item in menu" :key="item.url" :class="{ active: isActive(item) }">
            <RouterLink :to="localePath(item.url)" :aria-current="isActive(item) ? 'page' : undefined">
              {{ item.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="drawer-footer">
        <RouterLink :to="localePath('/contacts')" class="btn btn-primary btn-block">{{ t('BOOK_FITTING') }}</RouterLink>
        <LanguageSelector />
      </div>
    </div>
  </Teleport>
</template>

<style>
.menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-left: -12px;
}

.drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: rgb(28 25 23 / 45%);
}
.drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 191;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: min(86vw, 340px);
  padding: 8px 24px 24px;
  box-sizing: border-box;
  overflow-y: auto;
  background: var(--color-surface);
}
.drawer.open {
  animation: drawer-in 0.25s ease-out;
}
@keyframes drawer-in {
  from {
    transform: translateX(-100%);
  }
}
.drawer[hidden] {
  display: none;
}
.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
}
.drawer-head .eyebrow {
  margin: 0;
}
.drawer-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-right: -12px;
}
.drawer-links a {
  display: flex;
  align-items: center;
  min-height: 52px;
  border-bottom: 1px solid var(--color-border);
  font-family: var(--site-serif);
  font-size: 1.75rem;
}
.drawer-links li.active a {
  color: var(--color-accent-text);
}
.drawer-footer {
  display: grid;
  gap: 16px;
  margin-top: auto;
}
</style>
