<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { contactGroupsApi } from '@shared/api/resources/contactGroups'
import type { ContactGroup } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'

const props = defineProps<{
  // undefined: create a new contact group
  contactGroup?: ContactGroup
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

// the icon font classes the public site knows
const cssClasses = [
  { name: 'Mobile', id: 'ti-mobile' },
  { name: 'Viber', id: 'ti-viber' },
  { name: 'Email', id: 'ti-email' },
  { name: 'Skype', id: 'ti-skype' },
]

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const form = reactive({ name: '', css_class: undefined as string | undefined, published: false })

function reset() {
  form.name = props.contactGroup?.name ?? ''
  form.css_class = props.contactGroup?.css_class ?? undefined
  form.published = !!props.contactGroup?.published
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!props.contactGroup)
const canSave = computed(() => form.name.trim() !== '')

async function save() {
  const existing = props.contactGroup
  if (existing) {
    if (!(await run(() => contactGroupsApi.update(existing.slug, { ...form })))) return
    notify.updated('CONTACT_GROUP')
  } else {
    if (!(await run(() => contactGroupsApi.create({ ...form })))) return
    notify.created('CONTACT_GROUP')
  }
  visible.value = false
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    title="CONTACT_GROUP"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="cg-name" required>
        <InputText
          id="cg-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_CONTACT_GROUP_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('ICON')" for="cg-css-class">
        <Select
          v-model="form.css_class"
          input-id="cg-css-class"
          :options="cssClasses"
          option-label="name"
          option-value="id"
          :placeholder="t('CHOOSE')"
          show-clear
          class="w-full"
        />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="cg-published">
        <Checkbox v-model="form.published" input-id="cg-published" binary />
      </FormRow>
    </template>
  </EditorDialog>
</template>
