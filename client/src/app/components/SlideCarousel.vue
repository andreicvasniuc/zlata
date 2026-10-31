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

// slide links are paths of the site, e.g. /collection-shine
const hrefFor = (url?: string) => (url?.startsWith('/') ? localePath(url) : url)
</script>

<template>
  <div class="slide-carousel">
    <div ref="emblaRef" class="embla">
      <div class="embla__container">
        <div v-for="(slide, index) in slides" :key="slide.id" class="embla__slide item">
          <div class="text-overlay">
            <h1>{{ slide.title }}</h1>
            <div v-if="slide.link_url">
              <RouterLink v-if="slide.link_url.startsWith('/')" :to="hrefFor(slide.link_url)!" :title="slide.link_text">
                {{ slide.link_text }}
              </RouterLink>
              <a v-else :href="slide.link_url" :title="slide.link_text">{{ slide.link_text }}</a>
            </div>
          </div>
          <img :src="slide.image?.url" :alt="slide.title" :loading="index === 0 ? 'eager' : 'lazy'" />
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
      </div>
    </template>
  </div>
</template>

<style>
.slide-carousel {
  position: relative;
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
}
.slide-carousel .embla__slide img {
  display: block;
  width: 100%;
}

.slide-carousel .text-overlay {
  position: absolute;
  top: 45%;
  right: 0;
  left: 0;
  z-index: 1;
  text-align: center;
}
.slide-carousel .text-overlay h1 {
  font-size: 46px;
  text-transform: uppercase;
  color: #fff;
  text-shadow:
    1px 1px 2px #000,
    0 0 25px #d7d9d8,
    0 0 5px #d7d9d8;
  letter-spacing: 7px;
}
.slide-carousel .text-overlay a {
  display: block;
  width: 300px;
  max-width: 220px;
  margin: 30px auto 35px;
  padding: 5px 20px;
  font-family: Montserrat, Helvetica, Arial, Verdana, sans-serif;
  font-size: 14px;
  font-weight: 400;
  transition: 0.5s;
  text-transform: uppercase;
  color: #e7eaec;
  border: 1.4px solid #e7eaec;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.2);
}
.slide-carousel .text-overlay a:hover {
  color: #fff;
  border-color: #fff;
  background: rgba(0, 0, 0, 0.1);
}
@media screen and (max-width: 992px) {
  .slide-carousel .text-overlay {
    top: 30%;
  }
}
@media screen and (max-width: 768px) {
  .slide-carousel .text-overlay {
    top: 20%;
  }
  .slide-carousel .text-overlay h1 {
    font-size: 30px;
  }
  .slide-carousel .text-overlay a {
    font-size: 11px;
  }
}
@media screen and (max-width: 480px) {
  .slide-carousel .text-overlay {
    top: 10%;
  }
}

.slide-carousel .slide-nav {
  position: absolute;
  top: 50%;
  margin-top: -29px;
  z-index: 9999;
  color: #fff;
  font-size: 30px;
  transition: all 0.2s ease;
}
.slide-carousel .slide-nav-prev {
  left: 20px;
}
.slide-carousel .slide-nav-prev:hover {
  margin-left: -10px;
}
.slide-carousel .slide-nav-next {
  right: 20px;
}
.slide-carousel .slide-nav-next:hover {
  margin-right: -10px;
}
@media screen and (max-width: 768px) {
  .slide-carousel .slide-nav {
    display: none;
  }
}

/* the dots overlay the bottom of the slides, as with Owl */
.slide-carousel .slide-dots {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}
.slide-carousel .slide-dot {
  display: inline-block;
}
.slide-carousel .slide-dot span {
  display: block;
  width: 15px;
  height: 15px;
  margin: 5px 7px;
  border-radius: 30px;
  background: var(--color-accent);
  border: 2px solid transparent;
  transition: all 0.2s ease;
}
.slide-carousel .slide-dot:hover span,
.slide-carousel .slide-dot.active span {
  background: none;
  border-color: var(--color-accent);
}
</style>
