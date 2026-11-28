<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import type { Slide } from '@shared/types'
import { useLocalePath } from '../locale'

const props = defineProps<{ slides: Slide[]; autoplay?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()

// Same behaviour as the old Owl carousel: looping, 5s autoplay only when the slider has `autoplay` set, paused on hover.
const plugins = props.autoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true }, plugins)
// bound by name in the template (`ref="emblaRef"`)
void emblaRef

const selected = ref(0)
const snaps = shallowRef<number[]>([])

watchEffect((onCleanup) => {
  const api = emblaApi.value
  if (!api) return
  const update = () => {
    snaps.value = api.scrollSnapList()
    selected.value = api.selectedScrollSnap()
  }
  update()
  api.on('select', update).on('reInit', update)
  onCleanup(() => {
    api.off('select', update).off('reInit', update)
  })
})

onBeforeUnmount(() => emblaApi.value?.destroy())

// "1" -> "01" for the position counter
const pad = (value: number) => String(value).padStart(2, '0')

// slide links are paths of the site, e.g. /collection-shine
const hrefFor = (url?: string) => (url?.startsWith('/') ? localePath(url) : url)
</script>

<template>
  <div class="slide-carousel">
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div v-for="(slide, index) in slides" :key="slide.id" class="embla__slide item">
          <div class="text-overlay">
            <h2>{{ slide.title }}</h2>
            <div v-if="slide.link_url" class="slide-link">
              <RouterLink v-if="slide.link_url.startsWith('/')" :to="hrefFor(slide.link_url)!" :title="slide.link_text">
                {{ slide.link_text }}
              </RouterLink>
              <a v-else :href="slide.link_url" :title="slide.link_text">{{ slide.link_text }}</a>
            </div>
          </div>
          <img :src="slide.image?.url" alt="" :loading="index === 0 ? 'eager' : 'lazy'" />
        </div>
      </div>
    </div>

    <template v-if="slides.length > 1">
      <button
        type="button"
        class="slide-nav slide-nav-prev"
        :aria-label="t('PREVIOUS')"
        @click="emblaApi?.scrollPrev()"
      >
        <IconArrowLeft />
      </button>
      <button type="button" class="slide-nav slide-nav-next" :aria-label="t('NEXT')" @click="emblaApi?.scrollNext()">
        <IconArrowRight />
      </button>

      <div class="slide-dots">
        <span class="slide-counter" aria-hidden="true">{{ pad(selected + 1) }}</span>
        <button
          v-for="(_, index) in snaps"
          :key="index"
          type="button"
          class="slide-dot"
          :class="{ active: index === selected }"
          :aria-label="`${index + 1} / ${snaps.length}`"
          :aria-current="index === selected"
          @click="emblaApi?.scrollTo(index)"
        >
          <span></span>
        </button>
        <span class="slide-counter" aria-hidden="true">{{ pad(snaps.length) }}</span>
      </div>
    </template>
  </div>
</template>

<style>
.slide-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}
.slide-carousel .embla {
  overflow: hidden;
}
.slide-carousel .embla__container {
  display: flex;
}
.slide-carousel .embla__slide {
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
  height: clamp(420px, 72vh, 760px);
  background: var(--color-surface-alt);
}
.slide-carousel .embla__slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}
/* the gradient keeps the title readable over pale dresses */
.slide-carousel .embla__slide::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgb(20 17 15 / 0.68) 0%, rgb(20 17 15 / 0.25) 55%, transparent 100%);
  content: '';
}

.slide-carousel .text-overlay {
  position: absolute;
  bottom: 12%;
  left: clamp(24px, 6vw, 100px);
  right: 24px;
  z-index: 2;
  max-width: 720px;
}
.slide-carousel .text-overlay h2 {
  margin: 0;
  font-size: clamp(32px, 4.5vw, 60px);
  font-weight: 400;
  line-height: 1.1;
  color: #fff;
}
.slide-carousel .slide-link {
  margin-top: 28px;
}
.slide-carousel .slide-link a {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 32px;
  background: #fff;
  border-radius: 2px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-ink);
}
.slide-carousel .slide-link a:hover {
  background: var(--color-surface-alt);
  color: var(--color-ink);
}

.slide-carousel .slide-nav {
  position: absolute;
  top: 50%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-top: -24px;
  color: #fff;
  font-size: 26px;
}
.slide-carousel .slide-nav-prev {
  left: 12px;
}
.slide-carousel .slide-nav-next {
  right: 12px;
}
@media screen and (max-width: 768px) {
  .slide-carousel .slide-nav {
    display: none;
  }
}

/* "01 —— — 05": the position as a counter and thin progress bars */
.slide-carousel .slide-dots {
  position: absolute;
  right: clamp(16px, 4vw, 56px);
  bottom: 28px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-size: 0.78rem;
  letter-spacing: 0.16em;
}
.slide-carousel .slide-dot {
  display: flex;
  align-items: center;
  height: 24px;
}
.slide-carousel .slide-dot span {
  display: block;
  width: 32px;
  height: 2px;
  background: rgb(255 255 255 / 0.45);
  transition: all 0.3s ease;
}
.slide-carousel .slide-dot:hover span {
  background: rgb(255 255 255 / 0.8);
}
.slide-carousel .slide-dot.active span {
  width: 52px;
  background: #fff;
}
</style>
