<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconChevronLeft from '~icons/lucide/chevron-left'
import IconChevronRight from '~icons/lucide/chevron-right'
import type { Collection } from '@shared/types'
import { useLocalePath } from '../locale'

// Previous / next product of the collection, with the position ("3 / 13").
const props = defineProps<{ collection: Collection; index: number }>()

const { t } = useI18n()
const localePath = useLocalePath()

const products = computed(() => props.collection.products ?? [])
const hasPrevious = computed(() => props.index > 0)
const hasNext = computed(() => props.index < products.value.length - 1)

const urlAt = (position: number) => localePath(`/${props.collection.slug}/${products.value[position]?.slug}`)
</script>

<template>
  <nav class="navigation" :aria-label="collection.name">
    <RouterLink v-if="hasPrevious" :to="urlAt(index - 1)" :aria-label="t('PREVIOUS')" class="arrow arrow-left">
      <IconChevronLeft class="size-6" aria-hidden="true" />
    </RouterLink>
    <span v-else class="arrow" aria-hidden="true"></span>
    <span class="position">{{ index + 1 }} / {{ products.length }}</span>
    <RouterLink v-if="hasNext" :to="urlAt(index + 1)" :aria-label="t('NEXT')" class="arrow arrow-right">
      <IconChevronRight class="size-6" aria-hidden="true" />
    </RouterLink>
    <span v-else class="arrow" aria-hidden="true"></span>
  </nav>
</template>

<style>
.navigation {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--color-line);
  color: var(--color-ink-soft);
}
.navigation .arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
}
</style>
