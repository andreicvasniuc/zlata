<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocalePath } from '../locale'

export interface GridItem {
  id: string
  name: string
  // path without the locale prefix
  url: string
  image?: string
  // e.g. "from 1 200 €"; shown under the name only when set
  price?: string
}

// `wide`: a fourth column on large screens (the home page selection)
defineProps<{ items: GridItem[]; wide?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div id="portfolio">
    <ul class="portfolio-group" :class="{ wide }">
      <li v-for="item in items" :key="item.id" class="portfolio-item">
        <RouterLink :to="localePath(item.url)">
          <figure>
            <div class="item-photo">
              <img :alt="item.name" :src="item.image" loading="lazy" />
            </div>
            <figcaption>
              <h3>{{ item.name }}</h3>
              <p v-if="item.price" class="price">{{ item.price }}</p>
            </figcaption>
          </figure>
        </RouterLink>
      </li>

      <li v-if="items.length === 0" class="portfolio-empty">{{ t('NO_RECORDS_FOUND') }}</li>
    </ul>
  </div>
</template>

<style>
/* editorial lookbook: portrait frames, the name and price always visible under the photo */
.portfolio-group {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px 28px;
}
@media (min-width: 640px) {
  .portfolio-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (min-width: 1024px) {
  .portfolio-group {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (min-width: 1280px) {
  .portfolio-group.wide {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.portfolio-item > a {
  display: block;
}
.portfolio-item .item-photo {
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #efece6;
  box-shadow: var(--shadow-figure);
}
.portfolio-item .item-photo img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.5s ease-out;
}
.portfolio-item > a:hover .item-photo img {
  transform: scale(1.03);
}
.portfolio-item figcaption {
  padding-top: 16px;
}
.portfolio-item h3 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
  color: var(--color-ink);
}
.portfolio-item .price {
  margin: 4px 0 0;
  font-size: 0.95rem;
  color: var(--color-ink-soft);
}
.portfolio-empty {
  grid-column: 1 / -1;
  padding: 48px 0;
  text-align: center;
  color: var(--color-ink-soft);
}
</style>
