<script setup lang="ts">
import type { Color, ImageFile, Product, Size } from '@shared/types'
import ExtraField from './ExtraField.vue'
import ProductGallery from './ProductGallery.vue'

export interface ProductWithExtras extends Omit<Product, 'images'> {
  images: ImageFile[]
  colors: Color[]
  sizes: Size[]
}

defineProps<{ product: ProductWithExtras }>()
</script>

<template>
  <article class="item-details">
    <ProductGallery :images="product.images" :alt="product.name" />

    <div class="info">
      <slot />

      <h1>{{ product.name }}</h1>
      <div class="extra-fields">
        <ExtraField label="COLORS" :items="product.colors" />
        <ExtraField label="SIZES" :items="product.sizes" />
      </div>
      <div class="description">{{ product.description }}</div>
    </div>
  </article>
</template>

<style>
.item-details {
  box-sizing: border-box;
  margin: 0 auto;
  max-width: 1260px;
  padding: 0 20px;
  position: relative;
  width: 100%;
  min-height: 900px;
}
.item-details .gallery {
  max-width: 809px;
  position: absolute;
  top: 15px;
  width: 100%;
}
.item-details .gallery::after {
  clear: both;
  content: '';
  display: block;
}
.item-details .gallery a {
  display: block;
  float: left;
  border-bottom: none;
}
.item-details .gallery a.no-cover {
  margin: 0 0 15px 15px;
  cursor: pointer;
}
.item-details .gallery img {
  display: block;
  box-shadow: var(--shadow-figure);
  max-width: none;
  width: auto;
}
.item-details .gallery .cover img {
  height: 900px;
}
.item-details .gallery .no-cover img {
  height: 290px;
}
.item-details .info {
  margin-left: 824px;
  overflow: hidden;
}
.item-details .info h1 {
  width: 90%;
  display: block;
  margin: 75px auto 0;
  text-align: center;
  color: #99a098;
  font-size: 60px;
  line-height: 70px;
  border-bottom: 1px solid #ebebeb;
  padding-bottom: 30px;
}
.item-details .info .extra-fields {
  margin-top: 40px;
  text-align: center;
}
.item-details .info .extra-fields div {
  margin: 10px 0;
}
.item-details .info .extra-fields div span {
  font-size: 16px;
  font-style: normal;
  text-transform: uppercase;
}
.item-details .info .extra-fields div > span:first-child {
  color: #99a098;
}
.item-details .info .description {
  text-align: center;
  font-size: 14px;
  width: 90%;
  margin: 0 auto;
}

@media screen and (max-width: 850px) {
  .item-details {
    padding: 0;
    min-height: auto;
  }
  .item-details .gallery {
    position: static;
  }
  .item-details .gallery a {
    width: 47%;
  }
  .item-details .gallery a.cover {
    margin: 0 0 15px 15px;
    cursor: pointer;
  }
  .item-details .gallery img {
    width: 100%;
    height: auto !important;
  }
  .item-details .info {
    margin-left: 0;
  }
  .item-details .info h1 {
    margin-top: 0;
  }
}
@media screen and (max-width: 620px) {
  .item-details .gallery a.cover {
    width: 94%;
  }
}
@media screen and (max-width: 560px) {
  .item-details .gallery a.cover {
    width: 93%;
  }
}
@media screen and (max-width: 520px) {
  .item-details .gallery a.no-cover {
    width: 94%;
  }
}
@media screen and (max-width: 480px) {
  .item-details .gallery a.cover {
    width: 92%;
  }
}
@media screen and (max-width: 400px) {
  .item-details .gallery a.cover {
    width: 91%;
  }
}
@media screen and (max-width: 320px) {
  .item-details .gallery a.cover {
    width: 90%;
  }
}
</style>
