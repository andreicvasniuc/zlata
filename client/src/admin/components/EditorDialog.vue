<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tab from 'primevue/tab'
import TabList from 'primevue/tablist'
import TabPanel from 'primevue/tabpanel'
import TabPanels from 'primevue/tabpanels'
import Tabs from 'primevue/tabs'

defineProps<{
  // i18n key of the entity ("COLLECTION_" -> "Create/Edit Collection")
  title: string
  isEdit: boolean
  saving?: boolean
  canSave: boolean
  // dialogs with an image tab (only enabled once the entity exists)
  imageTab?: boolean
}>()

const visible = defineModel<boolean>('visible', { required: true })
const tab = defineModel<'basic' | 'images'>('tab', { default: 'basic' })
const emit = defineEmits<{ save: []; close: [] }>()

const { t } = useI18n()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :close-on-escape="false"
    :dismissable-mask="false"
    :style="{ width: '44rem', maxWidth: '95vw' }"
    @hide="emit('close')"
  >
    <template #header>
      <span class="text-lg font-semibold">{{ isEdit ? t('EDIT') : t('CREATE') }} {{ t(title) }}</span>
    </template>

    <Tabs v-if="imageTab" v-model:value="tab">
      <TabList>
        <Tab value="basic">{{ t('BASIC') }}</Tab>
        <Tab value="images" :disabled="!isEdit">{{ t('IMAGE_UPLOADING') }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="basic"><slot name="basic" /></TabPanel>
        <TabPanel value="images"><slot name="images" /></TabPanel>
      </TabPanels>
    </Tabs>
    <slot v-else name="basic" />

    <template #footer>
      <Button :label="t('CLOSE')" severity="secondary" outlined data-testid="editor-close" @click="visible = false" />
      <Button
        v-if="tab === 'basic' || !imageTab"
        :label="isEdit ? t('EDIT') : t('ADD')"
        :loading="saving"
        :disabled="!canSave"
        data-testid="editor-save"
        @click="emit('save')"
      />
    </template>
  </Dialog>
</template>
