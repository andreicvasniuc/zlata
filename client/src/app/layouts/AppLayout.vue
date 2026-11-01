<script setup lang="ts">
import { nextTick, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { currentLocale } from '@shared/api'
import { useSetLocale, useUrlLocale } from '../locale'
import { useLayout } from '../stores/layout'

const route = useRoute()
const layout = useLayout()
const setLocale = useSetLocale()
const urlLocale = useUrlLocale()

// A locale in the URL wins over the saved preference; without one the current language stays.
watch(
  urlLocale,
  (locale) => {
    if (locale && locale !== currentLocale.value) void setLocale(locale)
  },
  { immediate: true },
)

// Moving to another page closes the mobile menu and puts the keyboard focus on the new page.
watch(
  () => route.path,
  async () => {
    layout.hideMobileMenu()
    await nextTick()
    document.getElementById('main')?.focus({ preventScroll: true })
  },
)

// the page behind the open mobile menu does not scroll
watchEffect(() => document.body.classList.toggle('menu-open', layout.isMobileMenuVisible))
</script>

<template>
  <!-- pages remount when the path or the language changes, so every request is made in the right locale -->
  <RouterView :key="`${currentLocale}${route.path}`" />
</template>
