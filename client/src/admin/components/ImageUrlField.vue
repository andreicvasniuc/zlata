<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

// Images are added by URL (the old admin's file upload was already disabled).
defineProps<{
  image?: { url: string }
  uploading?: boolean
}>()

const emit = defineEmits<{ upload: [url: string]; remove: [] }>()

const { t } = useI18n()
const url = ref('')

function submit() {
  const value = url.value.trim()
  if (!value) return
  emit('upload', value)
  url.value = ''
}

// the pasted text reaches the model right after the paste event
const onPaste = () => setTimeout(submit, 0)
</script>

<template>
  <div class="p-2">
    <div v-if="image" class="inline-block text-center" data-testid="image-preview">
      <img :src="image.url" alt="" class="mb-2 max-h-64 max-w-full border border-border p-1" />
      <div>
        <Button
          :label="t('DELETE')"
          severity="danger"
          size="small"
          data-testid="image-remove"
          @click="emit('remove')"
        />
      </div>
    </div>
    <div v-else class="flex flex-col gap-2">
      <Textarea
        v-model="url"
        rows="3"
        class="w-full"
        :placeholder="t('DRAG_IMAGE_HERE')"
        data-testid="image-url"
        @paste="onPaste"
      />
      <div>
        <Button
          :label="t('UPLOAD')"
          :loading="uploading"
          :disabled="!url.trim()"
          size="small"
          data-testid="image-upload"
          @click="submit"
        />
      </div>
    </div>
  </div>
</template>
