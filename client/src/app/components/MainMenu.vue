<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMenu } from '../composables/useMenu'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const { menu, isActive } = useMenu()
const localePath = useLocalePath()
</script>

<template>
  <nav class="main-menu" :aria-label="t('MAIN_MENU')">
    <ul>
      <li v-for="item in menu" :key="item.url" :class="{ active: isActive(item) }">
        <RouterLink :to="localePath(item.url)" :aria-current="isActive(item) ? 'page' : undefined">
          {{ item.name }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style>
.main-menu ul {
  display: flex;
  gap: clamp(20px, 3vw, 48px);
}
.main-menu a {
  display: inline-block;
  padding: 8px 0;
  border-bottom: 1px solid transparent;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.main-menu a:hover {
  color: var(--color-ink);
}
.main-menu li.active a {
  color: var(--color-ink);
  border-bottom-color: var(--color-accent);
}
</style>
