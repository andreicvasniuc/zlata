<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconArrowRight from '~icons/lucide/arrow-right'
import { slidersApi } from '@shared/api/resources/public'
import AppFooter from '../components/AppFooter.vue'
import AppHeader from '../components/AppHeader.vue'
import TopProducts from '../components/TopProducts.vue'
import { useLoader } from '../composables/useLoader'
import { useMenu } from '../composables/useMenu'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'

const { t } = useI18n()
const localePath = useLocalePath()
const { menu } = useMenu()
usePageTitle()

// One static hero photograph: the picture of the first published slide of the home slider.
const { data: heroImage } = useLoader(async () => {
  const { slider } = await slidersApi.home()
  return slider?.slides?.find((slide) => slide.published !== false && slide.image?.url)?.image?.url
})
const heroFailed = ref(false)
const showHeroImage = computed(() => !!heroImage.value && !heroFailed.value)

const SHORTCUT_URLS = ['/collections', '/evening-dresses', '/accessories']
const shortcuts = computed(() => menu.value.filter((item) => SHORTCUT_URLS.includes(item.url)))
</script>

<template>
  <AppHeader />

  <main id="main" tabindex="-1">
    <section class="hero" :class="{ 'hero-text-only': !showHeroImage }">
      <div class="hero-copy">
        <p class="eyebrow">{{ t('LONG_SITE_NAME') }}</p>
        <h1>{{ t('HOME_HERO_TITLE') }}</h1>
        <p class="hero-text">{{ t('HOME_HERO_TEXT') }}</p>
        <div class="hero-actions">
          <RouterLink :to="localePath('/collections')" class="btn btn-primary">
            {{ t('HOME_CTA_PRIMARY') }}
            <IconArrowRight class="size-5" aria-hidden="true" />
          </RouterLink>
          <RouterLink :to="localePath('/contacts')" class="text-link">{{ t('HOME_CTA_SECONDARY') }}</RouterLink>
        </div>
      </div>
      <div v-if="showHeroImage" class="hero-photo">
        <img :src="heroImage" alt="" fetchpriority="high" @error="heroFailed = true" />
      </div>
    </section>

    <nav class="shortcuts site-container" :aria-label="t('CATEGORIES')">
      <ul>
        <li v-for="item in shortcuts" :key="item.url">
          <RouterLink :to="localePath(item.url)">
            {{ item.name }}
            <IconArrowRight class="size-5" aria-hidden="true" />
          </RouterLink>
        </li>
      </ul>
    </nav>

    <TopProducts />

    <section class="invite">
      <div class="site-container">
        <h2>{{ t('HOME_INVITE_TITLE') }}</h2>
        <p>{{ t('HOME_INVITE_TEXT') }}</p>
        <RouterLink :to="localePath('/contacts')" class="btn btn-primary">{{ t('CONTACTS') }}</RouterLink>
      </div>
    </section>
  </main>

  <AppFooter />
</template>

<style>
.hero {
  display: grid;
  background: var(--color-sand);
}
.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px var(--site-gutter);
}
.hero-copy h1 {
  max-width: 11ch;
  margin-bottom: 20px;
}
.hero-text {
  max-width: 440px;
  margin-bottom: 28px;
  font-size: 1.1rem;
  color: var(--color-ink-soft);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 28px;
}
.hero-photo {
  aspect-ratio: 4 / 3;
  background: #cfc8be;
}
.hero-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}
.hero-text-only .hero-copy {
  align-items: center;
  text-align: center;
  padding-top: 96px;
  padding-bottom: 96px;
}
.hero-text-only .hero-copy h1,
.hero-text-only .hero-text {
  max-width: 640px;
}

.shortcuts ul {
  display: grid;
  border-bottom: 1px solid var(--color-line);
}
.shortcuts a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
  border-top: 1px solid var(--color-line);
  font-size: 1.05rem;
}
.shortcuts li:first-child a {
  border-top: 0;
}

.invite {
  padding: 72px 0;
  background: var(--color-sand);
  text-align: center;
}
.invite p {
  margin-bottom: 24px;
  color: var(--color-ink-soft);
}

@media (min-width: 992px) {
  .hero {
    grid-template-columns: 1fr 1.25fr;
    min-height: 620px;
  }
  .hero-copy {
    padding-left: max(var(--site-gutter), calc((100vw - var(--site-max-width)) / 2 + var(--site-gutter)));
  }
  .hero-photo {
    aspect-ratio: auto;
  }
  .hero-text-only {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .shortcuts ul {
    grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
    border-bottom: 0;
  }
  .shortcuts li a {
    padding: 0 32px;
    border-top: 0;
    border-bottom: 1px solid var(--color-line);
  }
  .shortcuts li + li a {
    border-left: 1px solid var(--color-line);
  }
  .shortcuts li:first-child a {
    padding-left: 0;
  }
}
</style>
