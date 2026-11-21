<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { currentLocale } from '@shared/api'
import ToastHost from '../components/ToastHost.vue'
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

// a new page closes the mobile menu
watch(
  () => route.fullPath,
  () => layout.hideMobileMenu(),
)

const onResize = () => layout.onResize(window.innerWidth)
const onScroll = () => layout.onScroll(window.scrollY)

onMounted(() => {
  onResize()
  onScroll()
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
})

// the page behind the open mobile menu does not scroll
watchEffect(() => {
  document.body.classList.toggle('menu-open', layout.isMobileMenuVisible)
})
</script>

<template>
  <!-- pages remount when the path or the language changes, so every request is made in the right locale -->
  <RouterView :key="`${currentLocale}${route.path}`" />
  <ToastHost />
</template>
