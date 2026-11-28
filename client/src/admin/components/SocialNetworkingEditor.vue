<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { socialNetworkingsApi } from '@shared/api/resources/socialNetworkings'
import type { SocialNetworking } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'

const props = defineProps<{
  // undefined: create a new social networking
  socialNetworking?: SocialNetworking
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

// the icon font classes the public site knows
const cssClasses = [
  { name: 'Vkontakte', id: 'ti-vk' },
  { name: 'Facebook', id: 'ti-facebook' },
  { name: 'Instagram', id: 'ti-instagram' },
  { name: 'Pinterest', id: 'ti-pinterest-alt' },
  { name: 'Telegram', id: 'ti-telegram' },
]

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const form = reactive({ name: '', url: '', css_class: undefined as string | undefined, published: false })

function reset() {
  const item = props.socialNetworking
  form.name = item?.name ?? ''
  form.url = item?.url ?? ''
  form.css_class = item?.css_class ?? undefined
  form.published = !!item?.published
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!props.socialNetworking)
const canSave = computed(() => form.name.trim() !== '' && form.url.trim() !== '')

async function save() {
  const existing = props.socialNetworking
  if (existing) {
    if (!(await run(() => socialNetworkingsApi.update(existing.slug, { ...form })))) return
    notify.updated('SOCIAL_NETWORKING')
  } else {
    if (!(await run(() => socialNetworkingsApi.create({ ...form })))) return
    notify.created('SOCIAL_NETWORKING')
  }
  visible.value = false
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    title="SOCIAL_NETWORKING_"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="sn-name" required>
        <InputText
          id="sn-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_SOCIAL_NETWORKING_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('URL')" for="sn-url" required>
        <InputText id="sn-url" v-model="form.url" class="w-full" :placeholder="t('ENTER_SOCIAL_NETWORKING_URL')" />
      </FormRow>
      <FormRow :label="t('ICON')" for="sn-css-class">
        <Select
          v-model="form.css_class"
          input-id="sn-css-class"
          :options="cssClasses"
          option-label="name"
          option-value="id"
          :placeholder="t('CHOOSE')"
          show-clear
          class="w-full"
        />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="sn-published">
        <Checkbox v-model="form.published" input-id="sn-published" binary />
      </FormRow>
    </template>
  </EditorDialog>
</template>
