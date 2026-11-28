import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export type ItemKey =
  'COLLECTION' | 'PRODUCT' | 'SOCIAL_NETWORKING' | 'CONTACT_GROUP' | 'CONTACT' | 'SLIDER' | 'SLIDE' | 'SIZE' | 'COLOR'

// Grammatical gender matters in ua/ru: these items take the feminine forms ("WAS_ SAVED_").
const FEMININE: ItemKey[] = ['COLLECTION', 'SOCIAL_NETWORKING', 'CONTACT_GROUP', 'SLIDER']

type Action = 'SAVED' | 'CREATED' | 'UPDATED' | 'DELETED' | 'PUBLISHED' | 'UNPUBLISHED'

// Messages are built from translated words ("COLLECTION WAS_ SAVED_ SUCCESSFULLY"), as in the old admin.
export function useNotify() {
  const toast = useToast()
  const { t } = useI18n()

  const success = (ids: string[]) =>
    toast.add({ severity: 'success', summary: `${ids.map((id) => t(id)).join(' ')}.`, life: 4000 })

  const item = (key: ItemKey, action: Action) => {
    const ending = FEMININE.includes(key) ? '_' : ''
    success([key, `WAS${ending}`, `${action}${ending}`, 'SUCCESSFULLY'])
  }

  return {
    created: (key: ItemKey) => item(key, 'CREATED'),
    updated: (key: ItemKey) => item(key, 'UPDATED'),
    deleted: (key: ItemKey) => item(key, 'DELETED'),
    published: (key: ItemKey, published: boolean) => item(key, published ? 'PUBLISHED' : 'UNPUBLISHED'),
    imageUploaded: () => success(['IMAGE', 'WAS', 'UPLOADED', 'SUCCESSFULLY']),
    imageDeleted: () => success(['IMAGE', 'WAS', 'DELETED', 'SUCCESSFULLY']),
    imageMadeCover: () => success(['IMAGE', 'WAS', 'MADE', 'AS_COVER', 'SUCCESSFULLY']),
    error: (key: string, sticky = false) =>
      toast.add({ severity: 'error', summary: t(key), life: sticky ? undefined : 6000 }),
  }
}
