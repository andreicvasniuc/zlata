<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconHeart from '~icons/lucide/heart'
import { useLocalePath } from '../locale'
import { useFavourites } from '../stores/favourites'

const { t } = useI18n()
const favourites = useFavourites()
const localePath = useLocalePath()

const label = computed(() => (favourites.count ? `${t('FAVOURITES')} (${favourites.count})` : t('FAVOURITES')))
</script>

<template>
  <RouterLink :to="localePath('/favourites')" class="icon-button favourites-link" :aria-label="label" :title="label">
    <IconHeart />
    <span v-if="favourites.count" class="favourites-link__count" aria-hidden="true">{{ favourites.count }}</span>
  </RouterLink>
</template>

<style>
.favourites-link {
  position: relative;
}
.favourites-link svg {
  width: 21px;
  height: 21px;
}
.favourites-link__count {
  position: absolute;
  top: 6px;
  right: 3px;
  display: grid;
  place-items: center;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 9px;
  background: var(--z-ink);
  color: var(--z-bg);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
}
.site-header--transparent .favourites-link__count {
  background: #fff;
  color: var(--z-ink);
}
</style>
