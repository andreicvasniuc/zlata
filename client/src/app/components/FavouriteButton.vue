<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconHeart from '~icons/lucide/heart'
import { useFavourites, type FavouriteItem } from '../stores/favourites'

// The heart: saves a dress to the favourites list on this device, or removes it.
const props = defineProps<{ item: FavouriteItem; withLabel?: boolean }>()

const { t } = useI18n()
const favourites = useFavourites()
const saved = computed(() => favourites.has(props.item.id))
</script>

<template>
  <button
    type="button"
    class="favourite-button"
    :class="{ 'favourite-button--saved': saved, 'favourite-button--label': withLabel }"
    :aria-pressed="saved"
    :aria-label="withLabel ? undefined : t('ADD_TO_FAVOURITES', { name: item.name })"
    :title="withLabel ? undefined : t(saved ? 'REMOVE_FROM_FAVOURITES' : 'ADD_TO_FAVOURITES', { name: item.name })"
    @click.prevent.stop="favourites.toggle(item)"
  >
    <IconHeart aria-hidden="true" />
    <span v-if="withLabel">{{ saved ? t('SAVED') : t('SAVE') }}</span>
  </button>
</template>

<style>
.favourite-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--z-ink);
}
.favourite-button svg {
  width: 18px;
  height: 18px;
  transition:
    fill 0.2s ease,
    transform 0.2s ease;
}
.favourite-button--saved svg {
  fill: currentColor;
}
.favourite-button:active svg {
  transform: scale(0.85);
}
.favourite-button:not(.favourite-button--label) {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgb(250 248 245 / 0.92);
}
.favourite-button--label {
  font-size: 13px;
  color: var(--z-muted);
}
.favourite-button--label:hover,
.favourite-button--label.favourite-button--saved {
  color: var(--z-ink);
}
</style>
