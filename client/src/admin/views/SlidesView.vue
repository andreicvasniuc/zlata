<script setup lang="ts">
import { slidersApi } from '@shared/api/resources/sliders'
import ParentSelector from '../components/ParentSelector.vue'

const load = async () => (await slidersApi.list()).sliders
</script>

<template>
  <ParentSelector
    title="SLIDES"
    parent-label="SLIDER_"
    add-parent-label="GO_AND_ADD_SLIDERS"
    parent-list-path="/sliders"
    :load="load"
    :child-path="(slug) => `/slider/${encodeURIComponent(slug)}/slides`"
  />
</template>
