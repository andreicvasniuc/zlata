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
  top: 12px;
  right: 12px;
  z-index: 999999;
  pointer-events: none;
}
.toast-message {
  pointer-events: auto;
  width: 300px;
  margin-bottom: 6px;
  padding: 15px;
  border-radius: 3px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  opacity: 0.9;
  box-shadow: 0 0 12px #999;
  cursor: pointer;
}
.toast-message.success {
  background-color: #51a351;
}
.toast-message.error {
  background-color: #bd362f;
}
</style>
