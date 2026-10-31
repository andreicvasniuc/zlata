<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer id="fh5co-footer">
    <div class="bs-container">
      <SocialLinks />

      <p class="mb-0 text-center text-[#777]">
        <small class="text-[85%]">&copy; {{ currentYear }} Zlata</small>
      </p>
    </div>
  </footer>
</template>
