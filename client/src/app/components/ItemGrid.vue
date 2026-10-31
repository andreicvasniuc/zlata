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

defineProps<{ items: GridItem[] }>()

const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <div id="portfolio">
    <div class="bs-container">
      <div class="row">
        <ul class="portfolio-group">
          <li v-for="item in items" :key="item.id" class="portfolio-item">
            <RouterLink :to="localePath(item.url)">
              <figure>
                <img :alt="item.name" :src="item.image" />
                <figcaption>
                  <h3>{{ item.name }}</h3>
                  <p v-if="item.price" class="price">{{ item.price }}</p>
                </figcaption>
              </figure>
            </RouterLink>
          </li>

          <li v-if="items.length === 0" class="portfolio-item">{{ t('NO_RECORDS_FOUND') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
.portfolio-group {
  text-align: center;
  padding: 0;
  margin: 0;
  width: 100%;
  line-height: 26px;
}
.portfolio-group .portfolio-item {
  position: relative;
  float: left;
  width: 100%;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  margin-bottom: 30px;
  text-align: center;
  vertical-align: text-top;
  list-style: none;
}
@media (min-width: 768px) {
  .portfolio-group .portfolio-item {
    width: 50%;
  }
}
@media (min-width: 992px) {
  .portfolio-group .portfolio-item {
    width: 33.33%;
  }
}

.portfolio-group .portfolio-item > a {
  display: block;
  padding: 0;
  margin: 0;
  border-bottom: none;
}
.portfolio-group figure {
  border: 0 solid var(--color-border);
  margin: 1px;
  padding: 0;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-figure);
}
.portfolio-group figure img {
  max-width: 100%;
  display: block;
  position: relative;
  z-index: 0;
  transition: transform 0.4s ease-out;
}
.portfolio-group figcaption {
  color: #fff;
  bottom: 0;
  left: 0;
  padding: 30px 40px;
  background-color: var(--color-caption);
  text-align: left;
  text-transform: none;
  position: absolute;
  z-index: 1;
  height: 17%;
  width: 100%;
  opacity: 0;
  transition: opacity 0.5s 0.2s;
}
.portfolio-group h3 {
  color: #fff;
  margin: 0;
  padding: 0 0 5px;
  font-size: 20px;
  font-weight: 400;
  text-transform: uppercase;
  line-height: 1em;
  text-align: center;
}
/* a priced caption has a second line, so it grows instead of keeping the fixed height */
.portfolio-group figcaption:has(.price) {
  height: auto;
  min-height: 17%;
}
.portfolio-group figcaption .price {
  color: #fff;
  margin: 0;
  font-size: 16px;
  line-height: 1.3;
  text-align: center;
}

/* hover: the picture zooms and the caption fades in; on small screens the caption is always visible */
.portfolio-item figure:hover img {
  bottom: 0;
  transform: scale(1.2) translateY(7.5%);
}
.portfolio-item figure:hover figcaption,
.fh5co-overflow .portfolio-item figure figcaption {
  opacity: 0.7;
  transition: opacity 0.5s;
}
</style>
