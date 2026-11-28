<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { slidersApi } from '@shared/api/resources/sliders'
import type { Slider } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'

const props = defineProps<{
  // undefined: create a new slider
  slider?: Slider
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const form = reactive({ name: '', autoplay: false, published: false })

function reset() {
  form.name = props.slider?.name ?? ''
  form.autoplay = !!props.slider?.autoplay
  form.published = !!props.slider?.published
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!props.slider)
const canSave = computed(() => form.name.trim() !== '')

async function save() {
  const existing = props.slider
  if (existing) {
    if (!(await run(() => slidersApi.update(existing.slug, { ...form })))) return
    notify.updated('SLIDER')
  } else {
    if (!(await run(() => slidersApi.create({ ...form })))) return
    notify.created('SLIDER')
  }
  visible.value = false
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    title="SLIDER_"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="slider-name" required>
        <InputText
          id="slider-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_SLIDER_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('AUTOPLAY')" for="slider-autoplay">
        <Checkbox v-model="form.autoplay" input-id="slider-autoplay" binary />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="slider-published">
        <Checkbox v-model="form.published" input-id="slider-published" binary />
      </FormRow>
    </template>
  </EditorDialog>
</template>
