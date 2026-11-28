import { onBeforeUnmount, watchEffect, type MaybeRefOrGetter, toValue } from 'vue'
import { useLayout, type Section } from '../stores/layout'

// Tells the menu which section a collection or product page belongs to, so Collections or Accessories stays highlighted.
export function useActiveSection(section: MaybeRefOrGetter<Section | undefined>) {
  const layout = useLayout()
  watchEffect(() => (layout.activeSection = toValue(section)))
  onBeforeUnmount(() => (layout.activeSection = undefined))
}
