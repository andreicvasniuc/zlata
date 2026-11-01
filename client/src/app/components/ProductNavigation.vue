<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconArrowLeft from '~icons/lucide/arrow-left'
import IconArrowRight from '~icons/lucide/arrow-right'
import type { Collection } from '@shared/types'
import { useLocalePath } from '../locale'

// Previous / next product of the collection, with the position ("3 / 13").
const props = defineProps<{ collection: Collection; index: number }>()

const { t } = useI18n()
const localePath = useLocalePath()

const products = computed(() => props.collection.products ?? [])
const previous = computed(() => (props.index > 0 ? products.value[props.index - 1] : undefined))
const next = computed(() => (props.index < products.value.length - 1 ? products.value[props.index + 1] : undefined))

const urlOf = (slug?: string) => localePath(`/${props.collection.slug}/${slug}`)
</script>

<template>
  <div class="navigation">
    <RouterLink v-if="previous" :to="urlOf(previous.slug)" :aria-label="t('PREVIOUS')" class="arrow arrow-left">
      <IconArrowLeft class="size-4" aria-hidden="true" />
      <span class="neighbour">{{ previous.name }}</span>
    </RouterLink>
    <span class="position">{{ index + 1 }} / {{ products.length }}</span>
    <RouterLink v-if="next" :to="urlOf(next.slug)" :aria-label="t('NEXT')" class="arrow arrow-right">
      <span class="neighbour">{{ next.name }}</span>
      <IconArrowRight class="size-4" aria-hidden="true" />
    </RouterLink>
  </div>
</template>

<style>
.navigation {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-ink-soft);
}
.navigation .arrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: var(--color-ink);
}
.navigation .arrow:hover {
  color: var(--color-accent-hover);
}
/* the neighbours' names need room: on small screens only the arrows and the position remain */
.navigation .neighbour {
  display: none;
}
@media (min-width: 768px) {
  .navigation .neighbour {
    display: inline;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
