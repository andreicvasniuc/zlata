import { useConfirm as usePrimeConfirm } from 'primevue/useconfirm'
import { useI18n } from 'vue-i18n'

// Yes/No confirmation (the old modal alert); `messageKey` is an i18n key such as DELETE_COLLECTION_MESSAGE.
export function useConfirm() {
  const confirm = usePrimeConfirm()
  const { t } = useI18n()

  return (messageKey: string, onAccept: () => void | Promise<void>) =>
    confirm.require({
      message: t(messageKey),
      rejectProps: { label: t('NO'), severity: 'secondary', outlined: true },
      acceptProps: { label: t('YES'), severity: 'danger' },
      accept: () => void onAccept(),
    })
}
