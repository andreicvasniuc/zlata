<script setup lang="ts">
import { useNotifier } from '../stores/notifier'

const notifier = useNotifier()
</script>

<template>
  <div class="toast-host" aria-live="polite">
    <div
      v-for="toast in notifier.toasts"
      :key="toast.id"
      class="toast-message"
      :class="toast.kind"
      role="status"
      @click="notifier.dismiss(toast.id)"
    >
      {{ toast.text }}
    </div>
  </div>
</template>

<style>
.toast-host {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 1000;
  display: grid;
  gap: 8px;
  width: min(420px, calc(100vw - 32px));
  transform: translateX(-50%);
  pointer-events: none;
}
.toast-message {
  padding: 16px 20px;
  border-left: 3px solid var(--z-success);
  background: var(--z-ink);
  color: var(--z-bg);
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 20px 40px -20px rgb(0 0 0 / 0.5);
  cursor: pointer;
  pointer-events: auto;
}
.toast-message.error {
  border-left-color: #e06c5f;
}
body.has-product-bar .toast-host {
  bottom: 96px;
}
</style>
