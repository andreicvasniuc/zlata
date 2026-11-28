<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SocialLinks from './SocialLinks.vue'

const { t } = useI18n()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="fh5co-footer">
    <div class="site-container footer-inner">
      <p class="footer-brand">{{ t('LONG_SITE_NAME') }}</p>
      <SocialLinks />
      <p class="footer-copy">&copy; {{ currentYear }} Zlata</p>
    </div>
  </footer>
</template>

<style>
#fh5co-footer {
  background: var(--color-surface-alt);
  border-top: 1px solid var(--color-border);
  padding: 48px 0 40px;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}
.footer-brand {
  margin: 0;
  font-family: var(--site-serif);
  font-size: 1.75rem;
  letter-spacing: 0.04em;
}
.footer-copy {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-ink-soft);
}
</style>
