<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import type { ImageFile } from '@shared/types'

defineProps<{ images: ImageFile[]; alt?: string }>()

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
  </div>
</template>
