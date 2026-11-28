<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import type { ImageFile } from '@shared/types'

defineProps<{ images: ImageFile[]; alt?: string }>()

const { t } = useI18n()

const gallery = ref<HTMLElement | null>(null)
let lightbox: PhotoSwipeLightbox | undefined

// PhotoSwipe needs the pixel size of every picture; it is read from the thumbnails as they load. Until then a
// portrait placeholder size is used (PhotoSwipe corrects it once the full image arrives).
const FALLBACK_SIZE = { width: 1000, height: 1500 }
const sizes = reactive<Record<string, { width: number; height: number }>>({})

function onLoad(event: Event, id: string) {
  const image = event.target as HTMLImageElement
  if (image.naturalWidth && image.naturalHeight) {
    sizes[id] = { width: image.naturalWidth, height: image.naturalHeight }
  }
}

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({
    gallery: gallery.value as HTMLElement,
    children: 'a',
    pswpModule: () => import('photoswipe'),
  })
  lightbox.init()
})

onBeforeUnmount(() => {
  lightbox?.destroy()
  lightbox = undefined
})
</script>

<template>
  <div ref="gallery" class="gallery">
    <a
      v-for="image in images"
      :key="image.id"
      :href="image.url"
      :class="image.is_cover ? 'cover' : 'no-cover'"
      :data-pswp-width="(sizes[image.id] ?? FALLBACK_SIZE).width"
      :data-pswp-height="(sizes[image.id] ?? FALLBACK_SIZE).height"
      target="_blank"
      rel="noreferrer"
    >
      <img :src="image.url" :alt="alt" @load="onLoad($event, image.id)" />
    </a>
    <span v-if="images.length" class="zoom-hint" aria-hidden="true">{{ t('ZOOM_HINT') }}</span>
  </div>
</template>

<style>
/* the pictures sit in normal document flow, so a long gallery pushes the footer down instead of covering it */
.gallery {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  align-content: start;
}
.gallery a {
  display: block;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: #efece6;
  cursor: zoom-in;
}
.gallery img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.gallery .zoom-hint {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 8px 12px;
  background: #fff;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  pointer-events: none;
}
@media (max-width: 991px) {
  /* the first picture is shown large, the others in pairs below */
  .gallery a:first-of-type {
    grid-column: 1 / -1;
  }
}
</style>
