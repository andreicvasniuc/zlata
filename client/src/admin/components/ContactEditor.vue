<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Checkbox from 'primevue/checkbox'
import InputText from 'primevue/inputtext'
import { contactsApi } from '@shared/api/resources/contactGroups'
import type { Contact } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useNotify } from '../composables/useNotify'
import EditorDialog from './EditorDialog.vue'
import FormRow from './FormRow.vue'

const props = defineProps<{
  // slug of the contact group the contact belongs to
  contactGroupSlug: string
  // undefined: create a new contact
  contact?: Contact
}>()

const visible = defineModel<boolean>('visible', { required: true })
const emit = defineEmits<{ closed: [] }>()

const { t } = useI18n()
const notify = useNotify()
const { busy, run } = useBusy()

const form = reactive({ name: '', published: false })

function reset() {
  form.name = props.contact?.name ?? ''
  form.published = !!props.contact?.published
}

watch(visible, (open) => open && reset(), { immediate: true })

const isEdit = computed(() => !!props.contact)
const canSave = computed(() => form.name.trim() !== '')

async function save() {
  const existing = props.contact
  if (existing) {
    if (!(await run(() => contactsApi.update(props.contactGroupSlug, existing.slug, { ...form })))) return
    notify.updated('CONTACT')
  } else {
    if (!(await run(() => contactsApi.create(props.contactGroupSlug, { ...form })))) return
    notify.created('CONTACT')
  }
  visible.value = false
}
</script>

<template>
  <EditorDialog
    v-model:visible="visible"
    title="CONTACT"
    :is-edit="isEdit"
    :saving="busy"
    :can-save="canSave"
    @save="save"
    @close="emit('closed')"
  >
    <template #basic>
      <FormRow :label="t('NAME')" for="contact-name" required>
        <InputText
          id="contact-name"
          v-model="form.name"
          class="w-full"
          :placeholder="t('ENTER_CONTACT_NAME')"
          autofocus
        />
      </FormRow>
      <FormRow :label="t('PUBLISHED')" for="contact-published">
        <Checkbox v-model="form.published" input-id="contact-published" binary />
      </FormRow>
    </template>
  </EditorDialog>
</template>
