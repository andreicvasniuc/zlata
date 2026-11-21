<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import type { ImageFile } from '@shared/types'

// Desktop: a column of thumbnails next to the large photo. Phones: a swipeable row with a counter and dots.
// Every large photo opens in the PhotoSwipe lightbox.
const props = defineProps<{ images: ImageFile[]; alt?: string }>()

const { t } = useI18n()

const gallery = ref<HTMLElement | null>(null)
const current = ref(0)
let lightbox: PhotoSwipeLightbox | undefined

// PhotoSwipe needs the pixel size of every picture; it is read from the pictures as they load. Until then a
// portrait placeholder size is used (PhotoSwipe corrects it once the full image arrives).
const FALLBACK_SIZE = { width: 1000, height: 1500 }
const sizes = reactive<Record<string, { width: number; height: number }>>({})

function onLoad(event: Event, id: string) {
  const image = event.target as HTMLImageElement
  if (image.naturalWidth && image.naturalHeight) {
    sizes[id] = { width: image.naturalWidth, height: image.naturalHeight }
  }
}

function onScroll() {
  const track = gallery.value
  if (!track || !track.clientWidth) return
  current.value = Math.min(props.images.length - 1, Math.round(track.scrollLeft / track.clientWidth))
}

// a thumbnail (desktop) or a dot (phones) shows that photo
function select(index: number) {
  current.value = index
  const track = gallery.value
  if (track && track.scrollWidth > track.clientWidth)
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
}

watch(
  () => props.images,
  () => {
    current.value = 0
    gallery.value?.scrollTo({ left: 0 })
  },
)

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
  <div class="product-gallery">
    <ul v-if="images.length > 1" class="product-gallery__thumbs">
      <li v-for="(image, index) in images" :key="image.id">
        <button
          type="button"
          class="product-gallery__thumb"
          :class="{ 'product-gallery__thumb--active': index === current }"
          :aria-label="t('SHOW_PHOTO', { n: index + 1, total: images.length })"
          :aria-current="index === current ? 'true' : undefined"
          @click="select(index)"
        >
          <img :src="image.url" alt="" loading="lazy" decoding="async" />
        </button>
      </li>
    </ul>

    <div class="product-gallery__stage">
      <div ref="gallery" class="gallery product-gallery__track" @scroll.passive="onScroll">
        <a
          v-for="(image, index) in images"
          :key="image.id"
          :href="image.url"
          class="product-gallery__item"
          :class="[image.is_cover ? 'cover' : 'no-cover', { 'product-gallery__item--current': index === current }]"
          :data-pswp-width="(sizes[image.id] ?? FALLBACK_SIZE).width"
          :data-pswp-height="(sizes[image.id] ?? FALLBACK_SIZE).height"
          target="_blank"
          rel="noreferrer"
        >
          <img
            :src="image.url"
            :alt="alt"
            :loading="index < 2 ? 'eager' : 'lazy'"
            decoding="async"
            @load="onLoad($event, image.id)"
          />
        </a>
      </div>
      <p v-if="images.length > 1" class="product-gallery__counter" aria-hidden="true">
        {{ current + 1 }} / {{ images.length }}
      </p>
      <div v-if="images.length > 1" class="product-gallery__dots">
        <button
          v-for="(image, index) in images"
          :key="image.id"
          type="button"
          class="product-gallery__dot"
          :class="{ 'product-gallery__dot--active': index === current }"
          :aria-label="t('SHOW_PHOTO', { n: index + 1, total: images.length })"
          :aria-current="index === current ? 'true' : undefined"
          @click="select(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style>
.product-gallery {
  min-width: 0;
}
.product-gallery__stage {
  position: relative;
}
.product-gallery__track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}
.product-gallery__track::-webkit-scrollbar {
  display: none;
}
.product-gallery__item {
  flex: 0 0 100%;
  display: block;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--z-soft);
  scroll-snap-align: start;
  cursor: zoom-in;
}
.product-gallery__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
}
.product-gallery__thumbs {
  display: none;
}
.product-gallery__counter {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 10px;
  background: rgb(250 248 245 / 0.92);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.1em;
}
.product-gallery__dots {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: 8px;
}
.product-gallery__dot {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
}
.product-gallery__dot::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--z-line);
  transition: background-color 0.2s ease;
}
.product-gallery__dot--active::before {
  background: var(--z-ink);
}

@media (min-width: 1024px) {
  .product-gallery {
    display: grid;
    grid-template-columns: 84px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }
  .product-gallery__thumbs {
    display: grid;
    gap: 10px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .product-gallery__thumb {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border: 1px solid transparent;
    background: var(--z-soft);
    opacity: 0.6;
    transition:
      opacity 0.2s ease,
      border-color 0.2s ease;
  }
  .product-gallery__thumb:hover,
  .product-gallery__thumb--active {
    opacity: 1;
  }
  .product-gallery__thumb--active {
    border-color: var(--z-ink);
  }
  .product-gallery__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 15%;
  }
  /* one large photo at a time, never taller than the screen */
  .product-gallery__stage {
    max-width: calc((100vh - var(--z-header-h) - 48px) * 0.75);
  }
  .product-gallery__track {
    display: block;
    overflow: visible;
  }
  .product-gallery__item {
    display: none;
  }
  .product-gallery__item--current {
    display: block;
  }
  .product-gallery__counter,
  .product-gallery__dots {
    display: none;
  }
}
</style>
