import { watchEffect, type MaybeRefOrGetter, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

// `<site name>` on the home page, `<page title> | <site name>` everywhere else. Rails renders the same format into
// the HTML shell, so the title does not jump when the app takes over.
export const formatTitle = (siteName: string, pageTitle?: string): string =>
  pageTitle ? `${pageTitle} | ${siteName}` : siteName

export function usePageTitle(pageTitle?: MaybeRefOrGetter<string | undefined>) {
  const { t } = useI18n()
  watchEffect(() => {
    document.title = formatTitle(t('LONG_SITE_NAME'), pageTitle ? toValue(pageTitle) : undefined)
  })
}
