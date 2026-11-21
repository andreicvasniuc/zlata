<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { collectionsApi, productsApi, socialNetworkingsApi } from '@shared/api/resources/public'
import type { GridItem } from '../components/ItemGrid.vue'
import ItemGrid from '../components/ItemGrid.vue'
import PageLayout from '../components/PageLayout.vue'
import SocialLinks from '../components/SocialLinks.vue'
import TopProducts from '../components/TopProducts.vue'
import { contactsQuery } from '../contacts'
import { useLoader } from '../composables/useLoader'
import { usePageTitle } from '../composables/usePageTitle'
import { useLocalePath } from '../locale'
import { vReveal } from '../reveal'

const FEATURED_COLLECTIONS = 3
const INSTAGRAM_PICTURES = 6

const { t } = useI18n()
const localePath = useLocalePath()
usePageTitle()

const { data: collectionsData } = useLoader(async () => (await collectionsApi.dresses()).collections ?? [])
const { data: products } = useLoader(async () => (await productsApi.topList()).products ?? [])
const { data: socialNetworkings } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])

const collections = computed<GridItem[]>(() =>
  (collectionsData.value ?? []).slice(0, FEATURED_COLLECTIONS).map((collection) => ({
    id: collection.id,
    name: collection.name,
    url: `/${collection.slug}`,
    image: collection.image?.url,
  })),
)

const fittingImage = computed(() => {
  const all = collectionsData.value ?? []
  return (all[FEATURED_COLLECTIONS] ?? all[1] ?? all[0])?.image?.url
})

const steps = [
  { title: 'STEP_1_TITLE', text: 'STEP_1_TEXT' },
  { title: 'BOOK_FITTING', text: 'STEP_2_TEXT' },
  { title: 'STEP_3_TITLE', text: 'STEP_3_TEXT' },
  { title: 'STEP_4_TITLE', text: 'STEP_4_TEXT' },
]

// The Instagram strip shows dress pictures from the site and links to the profile.
const instagram = computed(() =>
  (socialNetworkings.value ?? []).find((network) => /instagram/i.test(`${network.css_class} ${network.slug}`)),
)
const instagramHandle = computed(() => {
  const path = instagram.value?.url.replace(/^https?:\/\/[^/]+\/?/, '').split(/[/?#]/)[0]
  return path ? `@${path}` : ''
})
const instagramPictures = computed(() => {
  const pictures = (products.value ?? []).map((product) => product.cover_image?.url).filter((url) => !!url)
  const rest = pictures.slice(8)
  return (rest.length >= INSTAGRAM_PICTURES ? rest : pictures).slice(0, INSTAGRAM_PICTURES) as string[]
})
</script>

<template>
  <PageLayout is-slider-visible>
    <section
      v-if="collections.length"
      v-reveal
      class="section home-collections"
      aria-labelledby="home-collections-title"
    >
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">{{ t('OUR_COLLECTIONS') }}</p>
            <h2 id="home-collections-title">{{ t('FIND_YOUR_DRESS') }}</h2>
          </div>
          <RouterLink :to="localePath('/collections')" class="text-link">{{ t('ALL_COLLECTIONS') }}</RouterLink>
        </div>
        <ItemGrid :items="collections" variant="collection" />
      </div>
    </section>

    <TopProducts />

    <section v-reveal class="section section--soft how-it-works" aria-labelledby="how-it-works-title">
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">{{ t('HOW_IT_WORKS') }}</p>
            <h2 id="how-it-works-title">{{ t('HOW_IT_WORKS_TITLE') }}</h2>
          </div>
        </div>
        <ol class="how-it-works__steps">
          <li v-for="(step, index) in steps" :key="step.title">
            <span class="how-it-works__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3>{{ t(step.title) }}</h3>
            <p>{{ t(step.text) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section v-reveal class="section fitting-cta" aria-labelledby="fitting-cta-title">
      <div class="wrap fitting-cta__inner">
        <div class="fitting-cta__media">
          <img v-if="fittingImage" :src="fittingImage" alt="" loading="lazy" decoding="async" />
        </div>
        <div class="fitting-cta__text">
          <p class="eyebrow">{{ t('FITTING_EYEBROW') }}</p>
          <h2 id="fitting-cta-title">{{ t('FITTING_TITLE') }}</h2>
          <p class="fitting-cta__lead">{{ t('FITTING_TEXT') }}</p>
          <RouterLink :to="{ path: localePath('/contacts'), query: contactsQuery('fitting') }" class="btn">
            {{ t('BOOK_FITTING') }}
          </RouterLink>
          <div class="fitting-cta__social">
            <span class="eyebrow">{{ t('OR_MESSAGE_US') }}</span>
            <SocialLinks messengers />
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="instagram && instagramPictures.length >= 3"
      v-reveal
      class="section section--flush-top instagram-strip"
      aria-labelledby="instagram-title"
    >
      <div class="wrap">
        <div class="section-head">
          <div>
            <p class="eyebrow">{{ instagramHandle }}</p>
            <h2 id="instagram-title">{{ t('INSTAGRAM_TITLE') }}</h2>
          </div>
          <a :href="instagram.url" target="_blank" rel="noopener noreferrer" class="text-link">Instagram</a>
        </div>
        <ul class="instagram-strip__grid">
          <li v-for="picture in instagramPictures" :key="picture">
            <a :href="instagram.url" target="_blank" rel="noopener noreferrer" tabindex="-1" aria-hidden="true">
              <img :src="picture" alt="" loading="lazy" decoding="async" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  </PageLayout>
</template>

<style>
@media (max-width: 767px) {
  .home-collections .item-grid__list {
    display: flex;
    gap: 12px;
    margin-right: calc(var(--z-gutter) * -1);
    padding-right: var(--z-gutter);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .home-collections .item-card {
    flex: 0 0 78%;
    scroll-snap-align: start;
  }
}

.how-it-works__steps {
  display: grid;
  gap: 36px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .how-it-works__steps {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1100px) {
  .how-it-works__steps {
    grid-template-columns: repeat(4, 1fr);
    gap: 48px;
  }
}
.how-it-works__number {
  font-family: var(--z-serif);
  font-size: 56px;
  line-height: 1;
  color: var(--z-accent);
}
.how-it-works__steps h3 {
  margin: 16px 0 8px;
  font-family: var(--z-sans);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.how-it-works__steps p {
  max-width: 300px;
  font-size: 14.5px;
  color: var(--z-muted);
}

.fitting-cta__inner {
  display: grid;
  align-items: center;
  gap: 40px;
}
@media (min-width: 900px) {
  .fitting-cta__inner {
    grid-template-columns: 1fr 1fr;
    gap: clamp(48px, 7vw, 110px);
  }
}
.fitting-cta__media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--z-soft);
}
.fitting-cta__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}
.fitting-cta__text h2 {
  margin: 12px 0 20px;
  font-size: clamp(40px, 5vw, 64px);
}
.fitting-cta__lead {
  max-width: 460px;
  margin-bottom: 32px;
  font-size: 16px;
  color: var(--z-muted);
}
.fitting-cta__social {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 18px;
  margin-top: 30px;
}
.fitting-cta__social .social-links--icons {
  margin-left: 0;
}

.instagram-strip__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
@media (min-width: 768px) {
  .instagram-strip__grid {
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
  }
}
.instagram-strip__grid a {
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  background: var(--z-soft);
}
.instagram-strip__grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transition:
    transform 0.6s ease,
    opacity 0.3s ease;
}
.instagram-strip__grid a:hover img {
  transform: scale(1.04);
  opacity: 0.9;
}
</style>
