<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { slidesApi } from '@shared/api/resources/sliders'
import type { ImageFile, Slide } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'
import ImageUrlField from './ImageUrlField.vue'

const props = defineProps<{
  // slug of the slider the slide belongs to
  sliderSlug: string
  // undefined: create a new slide
  slide?: Slide
  startTab?: 'basic' | 'images'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const current = ref<Slide>()
const image = ref<ImageFile>()
const tab = ref<'basic' | 'images'>('basic')
const form = reactive({ title: '', link_text: '', link_url: '', published: false })

function reset() {
  const slide = props.slide
  current.value = slide
  image.value = slide?.image
  tab.value = props.startTab ?? 'basic'
  form.title = slide?.title ?? ''
  form.link_text = slide?.link_text ?? ''
  form.link_url = slide?.link_url ?? ''
  form.published = !!slide?.published
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!current.value)
const canSave = computed(() => form.title.trim() !== '')

async function save() {
  const existing = current.value
  if (existing) {
    if (!(await run(() => slidesApi.update(props.sliderSlug, existing.slug, { ...form })))) return
    notify.updated('SLIDE')
    visible.value = false
  } else {
    const created = await run(() => slidesApi.create(props.sliderSlug, { ...form }))
    if (!created) return
    current.value = created
    notify.created('SLIDE')
    tab.value = 'images'
  }
}

async function upload(url: string) {
  const existing = current.value
  if (!existing) return
  const saved = await run(() => slidesApi.uploadImage(props.sliderSlug, existing.slug, url))
  if (!saved) return
  image.value = saved.image
  notify.imageUploaded()
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    v-model:tab="tab"
    title="SLIDE"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    image-tab
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('TITLE')" for="slide-title" required>
        <InputText
          id="slide-title"
          v-model="form.title"
          class="w-full"
          :placeholder="t('ENTER_SLIDE_TITLE')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('LINK_TEXT')" for="slide-link-text">
        <InputText
          id="slide-link-text"
          v-model="form.link_text"
          class="w-full"
          :placeholder="t('ENTER_SLIDE_LINK_TEXT')"
        />
      </FormRow>
      <FormRow :label="t('LINK_URL')" for="slide-link-url">
        <InputText
          id="slide-link-url"
          v-model="form.link_url"
          class="w-full"
          :placeholder="t('ENTER_SLIDE_LINK_URL')"
        />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="slide-published">
        <Checkbox v-model="form.published" input-id="slide-published" binary />
      </FormRow>
    </template>
    <template #images>
      <ImageUrlField :image="image" :uploading="busy" @upload="upload" @remove="image = undefined" />
    </template>
  </EditorDialog>
</template>
