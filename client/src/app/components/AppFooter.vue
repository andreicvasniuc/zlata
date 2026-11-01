<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useMenu } from '../composables/useMenu'
import { useLocalePath } from '../locale'
import SocialLinks from './SocialLinks.vue'

const { t } = useI18n()
const { menu } = useMenu()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="site-container site-footer-grid">
      <p class="site-footer-name">{{ t('LONG_SITE_NAME') }}</p>

      <nav :aria-label="t('FOOTER_NAVIGATION')">
        <ul class="site-footer-links">
          <li v-for="item in menu" :key="item.url">
            <RouterLink :to="localePath(item.url)">{{ item.name }}</RouterLink>
          </li>
        </ul>
      </nav>

      <SocialLinks />

      <p class="site-footer-copy">&copy; {{ currentYear }} Zlata</p>
    </div>
  </footer>
</template>

<style>
.site-footer {
  border-top: 1px solid var(--color-line);
  padding: 32px 0;
  font-size: 0.9rem;
  color: var(--color-ink-soft);
}
.site-footer-grid {
  display: grid;
  gap: 20px;
  align-items: center;
}
.site-footer-name {
  margin: 0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.site-footer-copy {
  margin: 0;
}
.site-footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0 24px;
}
.site-footer-links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
@media (min-width: 992px) {
  .site-footer-grid {
    grid-template-columns: auto 1fr auto auto;
    gap: 32px;
  }
  .site-footer-links {
    justify-content: center;
  }
}
</style>
