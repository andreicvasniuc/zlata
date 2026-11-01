<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import IconExpand from '~icons/lucide/maximize-2'
import type { ImageFile } from '@shared/types'
import CatalogImage from './CatalogImage.vue'

const props = defineProps<{ images: ImageFile[]; alt?: string }>()

const { t } = useI18n()

// The main photograph with a strip of thumbnails; the fullscreen view (zoom, swipe) is PhotoSwipe.
const current = ref(0)
const currentImage = computed(() => props.images[current.value])
let lightbox: PhotoSwipeLightbox | undefined

// PhotoSwipe needs the pixel size of every picture; it is read from the pictures as they load. Until then a portrait
// placeholder size is used (PhotoSwipe corrects it once the full image arrives).
const FALLBACK_SIZE = { width: 1000, height: 1500 }
const sizes = reactive<Record<string, { width: number; height: number }>>({})

function onLoad(event: Event, id: string) {
  const image = event.target as HTMLImageElement
  if (image.naturalWidth && image.naturalHeight) {
    sizes[id] = { width: image.naturalWidth, height: image.naturalHeight }
  }
}

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({ pswpModule: () => import('photoswipe') })
  lightbox.init()
})

onBeforeUnmount(() => {
  lightbox?.destroy()
  lightbox = undefined
})

function open() {
  lightbox?.loadAndOpen(
    current.value,
    props.images.map((image) => ({
      src: image.url,
      alt: props.alt,
      ...(sizes[image.id] ?? FALLBACK_SIZE),
    })),
  )
}

function step(by: number) {
  const next = current.value + by
  if (next >= 0 && next < props.images.length) current.value = next
}

// a horizontal swipe on the main photograph moves to the neighbouring one
let touchStartX: number | undefined
const SWIPE_DISTANCE = 50
function onTouchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0]?.clientX
  if (touchStartX !== undefined && endX !== undefined && Math.abs(endX - touchStartX) > SWIPE_DISTANCE) {
    step(endX < touchStartX ? 1 : -1)
  }
  touchStartX = undefined
}
</script>

<template>
  <div class="gallery">
    <button
      type="button"
      class="gallery-main"
      :aria-label="t('OPEN_PHOTO')"
      @click="open"
      @touchstart.passive="touchStartX = $event.touches[0]?.clientX"
      @touchend.passive="onTouchEnd"
    >
      <CatalogImage
        v-if="currentImage"
        :key="currentImage.id"
        :src="currentImage.url"
        :alt="alt"
        fit="contain"
        eager
        @load="onLoad($event, currentImage.id)"
      />
      <CatalogImage v-else :alt="alt" />
      <span v-if="images.length > 1" class="gallery-count" aria-hidden="true">
        {{ current + 1 }} / {{ images.length }}
      </span>
      <IconExpand class="gallery-expand size-5" aria-hidden="true" />
    </button>

    <ul v-if="images.length > 1" class="gallery-thumbs" :aria-label="t('PHOTOS')">
      <li v-for="(image, index) in images" :key="image.id">
        <button
          type="button"
          class="gallery-thumb"
          :aria-label="t('SHOW_PHOTO', { number: index + 1 })"
          :aria-current="index === current ? 'true' : undefined"
          @click="current = index"
        >
          <CatalogImage :src="image.url" alt="" fit="cover" @load="onLoad($event, image.id)" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style>
.gallery-main {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--color-sand);
  cursor: zoom-in;
}
.gallery-count,
.gallery-expand {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: var(--color-ivory);
}
.gallery-count {
  right: 56px;
  padding: 0 10px;
  font-size: 0.85rem;
  line-height: 32px;
}
.gallery-expand {
  box-sizing: content-box;
  padding: 6px;
}
.gallery-thumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.gallery-thumb {
  display: block;
  width: 64px;
  height: 88px;
  overflow: hidden;
  border: 1px solid transparent;
  background: var(--color-sand);
  opacity: 0.75;
}
.gallery-thumb[aria-current='true'] {
  border-color: var(--color-ink);
  opacity: 1;
}
@media (min-width: 992px) {
  .gallery-thumb {
    width: 72px;
    height: 96px;
  }
}
</style>
