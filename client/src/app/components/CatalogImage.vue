<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// A photograph in a box of fixed proportions. A missing or failed picture becomes a plain placeholder instead of a broken-image icon.
const props = withDefaults(defineProps<{ src?: string; alt?: string; fit?: 'cover' | 'contain'; eager?: boolean }>(), {
  src: undefined,
  alt: '',
  fit: 'cover',
})

const { t } = useI18n()
const failed = ref(false)
watch(
  () => props.src,
  () => (failed.value = false),
)
</script>

<template>
  <img
    v-if="src && !failed"
    class="catalog-image"
    :class="`fit-${fit}`"
    :src="src"
    :alt="alt"
    :loading="eager ? 'eager' : 'lazy'"
    decoding="async"
    @error="failed = true"
  />
  <div v-else class="photo-fallback" role="img" :aria-label="alt">
    <span aria-hidden="true">{{ src ? t('IMAGE_UNAVAILABLE') : t('NO_PHOTO') }}</span>
  </div>
</template>

<style>
.catalog-image {
  display: block;
  width: 100%;
  height: 100%;
}
.catalog-image.fit-cover {
  object-fit: cover;
}
.catalog-image.fit-contain {
  object-fit: contain;
}
</style>
