<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
  <div class="navigation">
    <RouterLink v-if="hasPrevious" :to="urlAt(index - 1)" :aria-label="t('PREVIOUS')" class="arrow arrow-left" />
    <span v-else class="arrow invisible"></span>
    <span class="position">{{ index + 1 }} / {{ products.length }}</span>
    <RouterLink v-if="hasNext" :to="urlAt(index + 1)" :aria-label="t('NEXT')" class="arrow arrow-right" />
    <span v-else class="arrow invisible"></span>
  </div>
</template>

<style>
.navigation {
  margin: 10px auto 0;
  text-align: center;
  color: #99a098;
  font-size: 30px;
}
.navigation .position {
  position: relative;
  bottom: 2px;
}
.navigation .arrow {
  display: inline-block;
  width: 0.6em;
  height: 0;
  margin: 0 6px;
  vertical-align: middle;
  border-top: 0.45em solid transparent;
  border-bottom: 0.45em solid transparent;
}
.navigation .arrow-left {
  border-right: 0.6em solid var(--color-accent);
  width: 0;
}
.navigation .arrow-right {
  border-left: 0.6em solid var(--color-accent);
  width: 0;
}
.navigation .arrow.invisible {
  border-color: transparent;
}
</style>
