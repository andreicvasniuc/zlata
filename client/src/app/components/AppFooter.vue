<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { contactGroupsApi } from '@shared/api/resources/public'
import logo from '../assets/logo-wordmark.png'
import { contactHref, contactsQuery, isShownContactGroup } from '../contacts'
import { useLoader } from '../composables/useLoader'
import { useLocalePath } from '../locale'
import LanguageSelector from './LanguageSelector.vue'
import SocialLinks from './SocialLinks.vue'

const { t } = useI18n()
const localePath = useLocalePath()
const currentYear = new Date().getFullYear()

const { data } = useLoader(async () => (await contactGroupsApi.list()).contact_groups ?? [])
const contacts = computed(() =>
  (data.value ?? [])
    .filter(isShownContactGroup)
    .flatMap((group) =>
      (group.contacts ?? []).map((contact) => ({
        id: contact.id,
        name: contact.name,
        href: contactHref(group, contact.name),
      })),
    ),
)
</script>

<template>
  <footer class="site-footer">
    <div class="wrap site-footer__top">
      <div class="site-footer__brand">
        <RouterLink :to="localePath('/')" class="site-footer__logo">
          <img :src="logo" :alt="t('LONG_SITE_NAME')" width="640" height="226" loading="lazy" />
        </RouterLink>
        <p>{{ t('FOOTER_TEXT') }}</p>
        <SocialLinks />
      </div>

      <nav aria-labelledby="footer-catalog">
        <h2 id="footer-catalog" class="site-footer__title">{{ t('CATALOG') }}</h2>
        <ul class="site-footer__links">
          <li>
            <RouterLink :to="localePath('/collections')">{{ t('COLLECTIONS') }}</RouterLink>
          </li>
          <li>
            <RouterLink :to="localePath('/accessories')">{{ t('ACCESSORIES') }}</RouterLink>
          </li>
          <li>
            <RouterLink :to="localePath('/favourites')">{{ t('FAVOURITES') }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div>
        <h2 class="site-footer__title">{{ t('CONTACTS') }}</h2>
        <ul class="site-footer__links">
          <li v-for="contact in contacts" :key="contact.id">
            <a v-if="contact.href" :href="contact.href">{{ contact.name }}</a>
            <span v-else>{{ contact.name }}</span>
          </li>
          <li>
            <RouterLink :to="localePath('/contacts')">{{ t('WRITE_TO_US') }}</RouterLink>
          </li>
          <li>
            <RouterLink :to="{ path: localePath('/contacts'), query: contactsQuery('fitting') }">
              {{ t('BOOK_FITTING') }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>

    <div class="wrap site-footer__bottom">
      <p>&copy; {{ currentYear }} Zlata Wedding Fashion</p>
      <LanguageSelector variant="inline" class="site-footer__lang" />
    </div>
  </footer>
</template>

<style>
.site-footer {
  padding-top: clamp(56px, 7vw, 88px);
  background: var(--z-ink);
  color: #e9e3da;
}
.site-footer__top {
  display: grid;
  gap: 40px;
}
@media (min-width: 768px) {
  .site-footer__top {
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 48px;
  }
}
.site-footer__logo img {
  width: auto;
  height: 40px;
  filter: invert(1);
}
.site-footer__brand p {
  max-width: 340px;
  margin: 22px 0 14px;
  font-size: 14px;
  color: #b8afa5;
}
.site-footer__title {
  margin-bottom: 18px;
  font-family: var(--z-sans);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #9c948b;
}
.site-footer__links {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  overflow-wrap: anywhere;
}
.site-footer__links a {
  transition: opacity 0.2s ease;
}
.site-footer__links a:hover {
  opacity: 0.65;
}
.site-footer :focus-visible {
  outline-color: #fff;
}
.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: clamp(40px, 6vw, 64px);
  padding-top: 24px;
  padding-bottom: 28px;
  border-top: 1px solid #3a3633;
  font-size: 12px;
  letter-spacing: 0.06em;
  color: #9c948b;
}
.site-footer__lang .language-selector__inline {
  border-color: #3a3633;
}
.site-footer__lang .language-selector__inline li + li {
  border-color: #3a3633;
}
.site-footer__lang .language-selector__inline a {
  padding: 7px 14px;
}
.site-footer__lang .language-selector__inline a[aria-current='true'] {
  background: #e9e3da;
  color: var(--z-ink);
}
</style>
