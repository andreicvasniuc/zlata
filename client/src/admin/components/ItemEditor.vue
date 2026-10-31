<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InputText from 'primevue/inputtext'
import type { ItemsApi } from '@shared/api/resources/items'
import type { Id } from '@shared/types'
import { useBusy } from '../composables/useBusy'
import { useConfirm } from '../composables/useConfirm'

interface Item {
  id: Id
  name: string
}

// The "add size / color" popover of the product editor: type a name and press Enter to add it,
// click a name to rename it (an empty name deletes the item after a confirmation).
const props = defineProps<{
  api: ItemsApi
  items: Item[]
  // i18n key, e.g. DELETE_SIZE_MESSAGE
  deleteMessage: string
}>()

const emit = defineEmits<{ changed: [] }>()

const { t } = useI18n()
const confirm = useConfirm()
const { run } = useBusy()

const newName = ref('')
const editingId = ref<Id>()
const editName = ref('')
const editInput = ref<{ $el: HTMLInputElement }[]>()

async function add() {
  const name = newName.value.trim()
  if (!name) return
  if (await run(() => props.api.create(name))) {
    newName.value = ''
    emit('changed')
  }
}

async function startEdit(item: Item) {
  editingId.value = item.id
  editName.value = item.name
  await nextTick()
  editInput.value?.[0]?.$el.focus()
}

async function finishEdit(item: Item) {
  const name = editName.value.trim()
  editingId.value = undefined
  if (!name) return remove(item)
  if (name === item.name) return
  if (await run(() => props.api.update(item.id, name))) emit('changed')
}

const remove = (item: Item) =>
  confirm(props.deleteMessage, async () => {
    if (await run(() => props.api.remove(item.id))) emit('changed')
  })
</script>

<template>
  <div class="w-64" data-testid="item-editor">
    <InputText
      v-model="newName"
      class="mb-2 w-full"
      :placeholder="t('ENTER')"
      data-testid="item-new"
      @keydown.enter.prevent="add"
    />
    <ul v-if="items.length" class="max-h-60 overflow-y-auto">
      <li v-for="item in items" :key="item.id" class="border-t border-border py-1">
        <InputText
          v-if="editingId === item.id"
          ref="editInput"
          v-model="editName"
          class="w-full"
          :placeholder="t('ENTER')"
          data-testid="item-edit"
          @keydown.enter.prevent="finishEdit(item)"
          @keydown.esc="editingId = undefined"
        />
        <button
          v-else
          type="button"
          class="w-full cursor-pointer text-left"
          data-testid="item-name"
          @click="startEdit(item)"
        >
          {{ item.name }}
        </button>
      </li>
    </ul>
    <p v-else class="text-center font-bold">{{ t('NO_RECORDS_FOUND') }}</p>
  </div>
</template>
