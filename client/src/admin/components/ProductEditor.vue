<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import MultiSelect from 'primevue/multiselect'
import Popover from 'primevue/popover'
import Textarea from 'primevue/textarea'
import { colorsApi, sizesApi } from '@shared/api/resources/items'
import { imagesApi, productsApi } from '@shared/api/resources/products'
import type { Color, ImageFile, Product, Size } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'
import ImageUrlField from './ImageUrlField.vue'
import ItemEditor from './ItemEditor.vue'

const props = defineProps<{
  // slug of the collection the product belongs to
  collectionSlug: string
  // undefined: create a new product
  product?: Product
  startTab?: 'basic' | 'images'
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

const { t } = useI18n()
const notify = useNotify()
const confirm = useConfirm()
const { busy, run } = useBusy()

const current = ref<Product>()
const tab = ref<'basic' | 'images'>('basic')
const sizes = ref<Size[]>([])
const colors = ref<Color[]>([])
const form = reactive({
  name: '',
  description: '',
  published: false,
  is_top: false,
  size_ids: [] as string[],
  color_ids: [] as string[],
})

const sizePopover = ref<InstanceType<typeof Popover>>()
const colorPopover = ref<InstanceType<typeof Popover>>()

async function loadSizes() {
  sizes.value = (await run(() => sizesApi.list())) ?? []
}
async function loadColors() {
  colors.value = (await run(() => colorsApi.list())) ?? []
}

function reset() {
  const product = props.product
  current.value = product
  tab.value = props.startTab ?? 'basic'
  form.name = product?.name ?? ''
  form.description = product?.description ?? ''
  form.published = !!product?.published
  form.is_top = !!product?.is_top
  form.size_ids = [...(product?.size_ids ?? [])]
  form.color_ids = [...(product?.color_ids ?? [])]
  void loadSizes()
  void loadColors()
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!current.value)
const canSave = computed(() => form.name.trim() !== '')
const images = computed<ImageFile[]>(() => current.value?.images ?? [])

async function save() {
  const existing = current.value
  if (existing) {
    const saved = await run(() => productsApi.update(props.collectionSlug, existing.slug, { ...form }))
    if (!saved) return
    notify.updated('PRODUCT')
    visible.value = false
  } else {
    const created = await run(() => productsApi.create(props.collectionSlug, { ...form }))
    if (!created) return
    current.value = created
    notify.created('PRODUCT')
    tab.value = 'images'
  }
}

async function makeCover(image: ImageFile) {
  const existing = current.value
  if (!existing || image.is_cover) return
  const saved = await run(() => imagesApi.makeCover(props.collectionSlug, existing.slug, image.id))
  if (!saved) return
  current.value = saved
  notify.imageMadeCover()
}

async function upload(url: string) {
  const existing = current.value
  if (!existing) return
  const saved = await run(() => imagesApi.upload(props.collectionSlug, existing.slug, url))
  if (!saved) return
  current.value = { ...existing, images: saved.images }
  notify.imageUploaded()
  // the first image becomes the cover
  if (saved.images.length === 1 && saved.images[0]) await makeCover(saved.images[0])
}

const removeImage = (image: ImageFile) =>
  confirm('DELETE_IMAGE_MESSAGE', async () => {
    const existing = current.value
    if (!existing) return
    const saved = await run(() => imagesApi.remove(props.collectionSlug, existing.slug, image.id))
    if (!saved) return
    current.value = saved
    notify.imageDeleted()
  })
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    v-model:tab="tab"
    title="PRODUCT"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    image-tab
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="product-name" required>
        <InputText
          id="product-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_PRODUCT_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('DESCRIPTION')" for="product-description">
        <Textarea
          id="product-description"
          v-model="form.description"
          rows="4"
          class="w-full"
          :placeholder="t('ENTER_DESCRIPTION')"
        />
      </FormRow>
      <FormRow :label="t('SIZE')" for="product-sizes">
        <div class="flex gap-2">
          <MultiSelect
            v-model="form.size_ids"
            input-id="product-sizes"
            :options="sizes"
            option-label="name"
            option-value="id"
            :placeholder="t('CHOOSE')"
            display="chip"
            class="min-w-0 flex-1"
          />
          <Button
            :label="t('ADD_SIZE')"
            severity="secondary"
            outlined
            data-testid="add-size"
            @click="sizePopover?.toggle($event)"
          />
        </div>
        <Popover ref="sizePopover">
          <ItemEditor :api="sizesApi" :items="sizes" delete-message="DELETE_SIZE_MESSAGE" @changed="loadSizes" />
        </Popover>
      </FormRow>
      <FormRow :label="t('COLOR')" for="product-colors">
        <div class="flex gap-2">
          <MultiSelect
            v-model="form.color_ids"
            input-id="product-colors"
            :options="colors"
            option-label="name"
            option-value="id"
            :placeholder="t('CHOOSE')"
            display="chip"
            class="min-w-0 flex-1"
          />
          <Button
            :label="t('ADD_COLOR')"
            severity="secondary"
            outlined
            data-testid="add-color"
            @click="colorPopover?.toggle($event)"
          />
        </div>
        <Popover ref="colorPopover">
          <ItemEditor :api="colorsApi" :items="colors" delete-message="DELETE_COLOR_MESSAGE" @changed="loadColors" />
        </Popover>
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="product-published">
        <Checkbox v-model="form.published" input-id="product-published" binary />
      </FormRow>
      <FormRow :label="t('TOP_PRODUCT')" for="product-top">
        <Checkbox v-model="form.is_top" input-id="product-top" binary />
      </FormRow>
    </template>

    <template #images>
      <ImageUrlField :uploading="busy" @upload="upload" />
      <div class="mt-4 flex flex-wrap gap-4" data-testid="product-images">
        <div v-for="image in images" :key="image.id" class="w-40 text-center" data-testid="product-image">
          <label class="mb-1 flex cursor-pointer items-center justify-center gap-1 text-sm">
            <input
              type="radio"
              name="cover"
              :checked="!!image.is_cover"
              :aria-label="image.is_cover ? t('COVER') : t('MAKE_COVER')"
              data-testid="image-cover"
              @change="makeCover(image)"
            />
            {{ image.is_cover ? t('COVER') : t('MAKE_COVER') }}
          </label>
          <button
            type="button"
            class="mb-1 block w-full cursor-pointer border border-border p-1"
            @click="makeCover(image)"
          >
            <img :src="image.url" alt="" class="mx-auto max-h-40 max-w-full" />
          </button>
          <Button
            :label="t('DELETE')"
            severity="danger"
            size="small"
            data-testid="image-delete"
            @click="removeImage(image)"
          />
        </div>
      </div>
    </template>
  </EditorDialog>
</template>
