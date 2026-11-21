<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { colorSwatch } from '../product'

// A product attribute (colours, sizes) as a row of chips, with a colour swatch when `swatches` is set and the colour
// is known; nothing at all when the product has none.
defineProps<{ label: string; items?: { id: string; name: string }[]; swatches?: boolean }>()

const { t } = useI18n()
</script>

<template>
  <div v-if="items?.length" class="product-spec">
    <dt class="product-spec__label">{{ t(label) }}</dt>
    <dd class="product-spec__values">
      <span v-for="item in items" :key="item.id" class="product-spec__chip">
        <span
          v-if="swatches && colorSwatch(item.name)"
          class="product-spec__swatch"
          :style="{ backgroundColor: colorSwatch(item.name) }"
          aria-hidden="true"
        ></span>
        {{ item.name }}
      </span>
    </dd>
  </div>
</template>

<style>
.product-spec {
  padding: 18px 0;
  border-top: 1px solid var(--z-line);
}
.product-spec__label {
  margin-bottom: 12px;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.product-spec__values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}
.product-spec__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 52px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--z-line);
  background: var(--z-surface);
  font-size: 13.5px;
  text-transform: capitalize;
}
.product-spec__swatch {
  flex: none;
  width: 16px;
  height: 16px;
  border: 1px solid rgb(28 26 25 / 0.2);
  border-radius: 50%;
}
</style>
