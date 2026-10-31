<script setup lang="ts">
import { socialNetworkingsApi } from '@shared/api/resources/public'
import { iconForClass } from '../icons'
import { useLoader } from '../composables/useLoader'
import LoadingIcon from './LoadingIcon.vue'

const { data, loading } = useLoader(async () => (await socialNetworkingsApi.list()).social_networkings ?? [])
</script>

<template>
  <LoadingIcon v-show="loading" />

  <ul v-show="!loading" class="fh5co-social-icons">
    <li v-for="socialNetworking in data" :key="socialNetworking.id">
      <a :href="socialNetworking.url" :title="socialNetworking.name" :aria-label="socialNetworking.name">
        <component :is="iconForClass(socialNetworking.css_class)" class="size-[30px]" />
      </a>
    </li>
  </ul>
</template>

<style>
.fh5co-social-icons {
  text-align: center;
  padding: 0;
  margin: 0 0 2em 0;
}
.fh5co-social-icons li {
  list-style: none;
  display: inline-block;
  vertical-align: top;
  /* the Themify glyph boxes made the old row 57px tall with the icon centred 37px from the top */
  box-sizing: border-box;
  height: 57px;
  padding-top: 22px;
}
.fh5co-social-icons li svg {
  margin: 0 6px;
}
.fh5co-social-icons li a {
  display: inline-block;
  padding: 0 10px;
  border-bottom: none !important;
}
</style>
