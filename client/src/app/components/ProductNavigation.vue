<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import type { Collection } from '@shared/types'
import { useLocalePath } from '../locale'

// Previous / next product of the collection, with the dress names.
const props = defineProps<{ collection: Collection; index: number }>()

const { t } = useI18n()
const localePath = useLocalePath()

const products = computed(() => props.collection.products ?? [])
const previous = computed(() => (props.index > 0 ? products.value[props.index - 1] : undefined))
const next = computed(() => products.value[props.index + 1])

const urlOf = (slug: string) => localePath(`/${props.collection.slug}/${slug}`)
</script>

<template>
  <nav class="product-nav navigation wrap" :aria-label="collection.name">
    <RouterLink v-if="previous" :to="urlOf(previous.slug)" class="product-nav__link arrow-left" rel="prev">
      <IconArrowLeft aria-hidden="true" />
      <span>
        <span class="eyebrow">{{ t('PREVIOUS') }}</span>
        <span class="product-nav__name">{{ previous.name }}</span>
      </span>
    </RouterLink>
    <span v-else></span>

    <RouterLink
      v-if="next"
      :to="urlOf(next.slug)"
      class="product-nav__link product-nav__link--next arrow-right"
      rel="next"
    >
      <span>
        <span class="eyebrow">{{ t('NEXT') }}</span>
        <span class="product-nav__name">{{ next.name }}</span>
      </span>
      <IconArrowRight aria-hidden="true" />
    </RouterLink>
    <span v-else></span>
  </nav>
</template>

<style>
.product-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 16px;
  margin-top: clamp(48px, 6vw, 80px);
}
.product-nav::before {
  content: '';
  grid-column: 1 / -1;
  height: 1px;
  margin-bottom: 8px;
  background: var(--z-line);
}
.product-nav__link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  justify-self: start;
  padding: 8px 0;
  transition: opacity 0.2s ease;
}
.product-nav__link:hover {
  opacity: 0.6;
}
.product-nav__link--next {
  justify-self: end;
  text-align: right;
}
.product-nav__link svg {
  flex: none;
  width: 18px;
  height: 18px;
}
.product-nav__link .eyebrow {
  display: block;
}
.product-nav__name {
  display: block;
  font-family: var(--z-serif);
  font-size: clamp(18px, 2vw, 26px);
  line-height: 1.2;
  overflow-wrap: anywhere;
}
</style>
