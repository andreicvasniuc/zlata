<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { collectionsApi } from '@shared/api/resources/collections'
import type { Collection, ImageFile } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'
import ImageUrlField from './ImageUrlField.vue'

const props = defineProps<{
  // undefined: create a new collection
  collection?: Collection
  startTab?: 'basic' | 'images'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const current = ref<Collection>()
const image = ref<ImageFile>()
const tab = ref<'basic' | 'images'>('basic')
const form = reactive({ name: '', description: '', published: false, has_accessories: false })

function reset() {
  current.value = props.collection
  image.value = props.collection?.image
  tab.value = props.startTab ?? 'basic'
  form.name = props.collection?.name ?? ''
  form.description = props.collection?.description ?? ''
  form.published = !!props.collection?.published
  form.has_accessories = !!props.collection?.has_accessories
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!current.value)
const canSave = computed(() => form.name.trim() !== '')

async function save() {
  const existing = current.value
  if (existing) {
    const saved = await run(() => collectionsApi.update(existing.slug, { ...form }))
    if (!saved) return
    notify.updated('COLLECTION')
    visible.value = false
  } else {
    const created = await run(() => collectionsApi.create({ ...form }))
    if (!created) return
    current.value = created
    notify.created('COLLECTION')
    tab.value = 'images'
  }
}

async function upload(url: string) {
  const existing = current.value
  if (!existing) return
  const saved = await run(() => collectionsApi.uploadImage(existing.slug, url))
  if (!saved) return
  image.value = saved.image
  notify.imageUploaded()
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    v-model:tab="tab"
    title="COLLECTION_"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    image-tab
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="collection-name" required>
        <InputText
          id="collection-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_COLLECTION_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('DESCRIPTION')" for="collection-description">
        <Textarea
          id="collection-description"
          v-model="form.description"
          rows="4"
          class="w-full"
          :placeholder="t('ENTER_DESCRIPTION')"
        />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="collection-published">
        <Checkbox v-model="form.published" input-id="collection-published" binary />
      </FormRow>
      <FormRow :label="t('ACCESSORIES')" for="collection-accessories">
        <Checkbox v-model="form.has_accessories" input-id="collection-accessories" binary />
      </FormRow>
    </template>
    <template #images>
      <ImageUrlField :image="image" :uploading="busy" @upload="upload" @remove="image = undefined" />
    </template>
  </EditorDialog>
</template>
