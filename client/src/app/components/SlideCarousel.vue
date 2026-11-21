<script setup lang="ts">
import { onBeforeUnmount, ref, shallowRef, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import emblaCarouselVue from 'embla-carousel-vue'
import Autoplay from 'embla-carousel-autoplay'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import IconPause from '~icons/lucide/pause'
import IconPlay from '~icons/lucide/play'
import type { Slide } from '@shared/types'
import { contactsQuery } from '../contacts'
import { useLocalePath } from '../locale'

const props = defineProps<{ slides: Slide[]; autoplay?: boolean }>()

const { t } = useI18n()
const localePath = useLocalePath()

// Loops; autoplays every 5s only when the slider has `autoplay` set and the visitor has not asked for reduced motion.
// Hovering pauses it for a moment, the pause button stops it until it is pressed again.
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
const hasAutoplay = !!props.autoplay && props.slides.length > 1 && !prefersReducedMotion
const plugins = hasAutoplay ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })] : []
const [emblaRef, emblaApi] = emblaCarouselVue({ loop: true }, plugins)
// bound by name in the template (`ref="emblaRef"`)
void emblaRef

const selected = ref(0)
const snaps = shallowRef<number[]>([])
const isPaused = ref(false)

watchEffect((onCleanup) => {
  const api = emblaApi.value
  if (!api) return
  const update = () => {
    snaps.value = api.scrollSnapList()
    selected.value = api.selectedScrollSnap()
  }
  // the plugin restarts itself when the mouse leaves; a paused slider stays paused
  const keepPaused = () => {
    if (isPaused.value) api.plugins().autoplay?.stop()
  }
  update()
  api.on('select', update).on('reInit', update).on('autoplay:play', keepPaused)
  onCleanup(() => {
    api.off('select', update).off('reInit', update).off('autoplay:play', keepPaused)
  })
})

onBeforeUnmount(() => emblaApi.value?.destroy())

function togglePause() {
  const autoplay = emblaApi.value?.plugins().autoplay
  isPaused.value = !isPaused.value
  if (isPaused.value) autoplay?.stop()
  else autoplay?.play()
}

const pad = (value: number) => String(value).padStart(2, '0')

// The button names the collection instead of repeating the slide's title.
const linkLabel = (slide: Slide) =>
  slide.link_text && slide.link_text.trim().toLowerCase() !== slide.title.trim().toLowerCase()
    ? slide.link_text
    : t('DISCOVER')
const isSitePath = (url: string) => url.startsWith('/')
</script>

<template>
  <div class="hero" aria-roledescription="carousel">
    <div ref="emblaRef" class="hero__viewport embla">
      <div class="embla__container">
        <div
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="embla__slide hero__slide"
          role="group"
          aria-roledescription="slide"
          :aria-label="t('SLIDE_OF', { n: index + 1, total: slides.length })"
        >
          <img
            class="hero__image"
            :src="slide.image?.url"
            alt=""
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : undefined"
            decoding="async"
          />
          <div class="hero__content wrap">
            <h2 class="hero__title">{{ slide.title }}</h2>
            <div class="hero__actions">
              <template v-if="slide.link_url">
                <RouterLink v-if="isSitePath(slide.link_url)" :to="localePath(slide.link_url)" class="btn btn--light">
                  {{ linkLabel(slide) }}
                </RouterLink>
                <a v-else :href="slide.link_url" class="btn btn--light">{{ linkLabel(slide) }}</a>
              </template>
              <RouterLink
                :to="{ path: localePath('/contacts'), query: contactsQuery('fitting') }"
                class="btn btn--ghost-light"
              >
                {{ t('BOOK_FITTING') }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="slides.length > 1" class="hero__controls wrap">
      <span class="hero__count" aria-hidden="true">{{ pad(selected + 1) }}</span>
      <div class="hero__dots">
        <button
          v-for="(_, index) in snaps"
          :key="index"
          type="button"
          class="hero__dot slide-dot"
          :class="{ active: index === selected }"
          :aria-label="t('SLIDE_OF', { n: index + 1, total: snaps.length })"
          :aria-current="index === selected ? 'true' : undefined"
          @click="emblaApi?.scrollTo(index)"
        ></button>
      </div>
      <span class="hero__count" aria-hidden="true">{{ pad(snaps.length) }}</span>

      <div class="hero__buttons">
        <button
          v-if="hasAutoplay"
          type="button"
          class="hero__button hero__pause"
          :aria-label="isPaused ? t('PLAY') : t('PAUSE')"
          :aria-pressed="isPaused"
          @click="togglePause"
        >
          <IconPlay v-if="isPaused" />
          <IconPause v-else />
        </button>
        <button
          type="button"
          class="hero__button slide-nav-prev"
          :aria-label="t('PREVIOUS')"
          @click="emblaApi?.scrollPrev()"
        >
          <IconArrowLeft />
        </button>
        <button type="button" class="hero__button slide-nav-next" :aria-label="t('NEXT')" @click="emblaApi?.scrollNext()">
          <IconArrowRight />
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.hero {
  position: relative;
  height: max(560px, min(100svh, 960px));
  overflow: hidden;
  background: var(--z-ink);
  color: #fff;
}
.hero__viewport,
.hero .embla__container,
.hero__slide {
  height: 100%;
}
.hero__viewport {
  overflow: hidden;
}
.hero .embla__container {
  display: flex;
}
.hero__slide {
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
}
.hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
}
.hero__slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(0deg, rgb(22 19 17 / 0.62), rgb(22 19 17 / 0) 58%),
    linear-gradient(90deg, rgb(22 19 17 / 0.35), rgb(22 19 17 / 0) 55%);
}
.hero__content {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 120px;
  z-index: 1;
}
.hero__title {
  max-width: 820px;
  font-size: clamp(42px, 7vw, 96px);
  line-height: 0.98;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
  text-wrap: balance;
}
.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero__controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 14px;
}
.hero__count {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.16em;
}
.hero__dots {
  display: flex;
  gap: 6px;
}
.hero__dot {
  position: relative;
  width: 44px;
  height: 24px;
}
.hero__dot::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: rgb(255 255 255 / 0.4);
  transition:
    background-color 0.3s ease,
    height 0.3s ease;
}
.hero__dot:hover::before,
.hero__dot.active::before {
  height: 2px;
  margin-top: -0.5px;
  background: #fff;
}
.hero__buttons {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.hero__button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgb(255 255 255 / 0.45);
  border-radius: 50%;
  color: #fff;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}
.hero__button:hover {
  background: #fff;
  color: var(--z-ink);
}
.hero__button svg {
  width: 18px;
  height: 18px;
}
.hero :focus-visible {
  outline-color: #fff;
}

@media (max-width: 767px) {
  .hero {
    height: max(520px, min(86svh, 760px));
  }
  .hero__content {
    bottom: 96px;
  }
  .hero__actions .btn {
    flex: 1 1 100%;
  }
  .hero__dot {
    width: 28px;
  }
  .hero__buttons .slide-nav-prev,
  .hero__buttons .slide-nav-next {
    display: none;
  }
}
</style>
