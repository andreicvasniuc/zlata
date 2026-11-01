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
  gap: clamp(16px, 2.4vw, 36px);
}
.main-menu a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  border-bottom: 1px solid transparent;
  font-size: 0.95rem;
  color: var(--color-ink);
}
.main-menu a:hover {
  border-bottom-color: var(--color-taupe);
}
.main-menu li.active a {
  border-bottom-color: var(--color-ink);
}
</style>
