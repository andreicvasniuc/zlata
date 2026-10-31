<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Select from 'primevue/select'
import { useBusy } from '../composables/useBusy'
import PageHeading from './PageHeading.vue'

interface Option {
  id: string
  name: string
  slug: string
}

// `/products`, `/contacts` and `/slides` have no list of their own: pick the collection / contact group / slider
// whose items you want to manage (the old admin showed this as a modal).
const props = defineProps<{
  // i18n keys
  title: string
  parentLabel: string
  addParentLabel: string
  load: () => Promise<Option[]>
  // where to go when a parent is picked, and where to go to create the first one
  childPath: (slug: string) => string
  parentListPath: string
}>()

const { t } = useI18n()
const router = useRouter()
const { run } = useBusy()

const options = ref<Option[]>()
const selected = ref<string>()

onMounted(async () => {
  options.value = (await run(props.load)) ?? []
})

const choose = (slug: string) => router.push(props.childPath(slug))
</script>

<template>
  <PageHeading :title="title" />
  <div class="max-w-md border border-border bg-white p-6" data-testid="parent-selector">
    <template v-if="options">
      <Select
        v-if="options.length"
        v-model="selected"
        :options="options"
        option-label="name"
        option-value="slug"
        :placeholder="`${t('SELECT')} ${t(parentLabel)}`"
        class="w-full"
        data-testid="parent-select"
        @update:model-value="choose"
      />
      <button
        v-else
        type="button"
        class="cursor-pointer border border-border bg-white px-4 py-1.5 text-sm hover:bg-surface"
        @click="router.push(parentListPath)"
      >
        {{ t(addParentLabel) }}
      </button>
    </template>
  </div>
</template>
