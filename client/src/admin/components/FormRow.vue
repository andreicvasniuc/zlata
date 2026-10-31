<script setup lang="ts">
defineProps<{
  label: string
  // id of the control, for the label
  for: string
  required?: boolean
}>()
</script>

<template>
  <div class="mb-4 grid grid-cols-[8rem_1fr] items-center gap-3">
    <label
      :for="$props.for"
      class="first-letter:uppercase"
      :class="{ 'after:ml-1 after:text-danger after:content-[\'*\']': required }"
      >{{ label }}</label
    >
    <div><slot /></div>
  </div>
</template>
