import { onBeforeUnmount, onMounted, type Ref } from 'vue'

// Calls `handler` for clicks outside `target` (and outside anything matching `exceptSelector`).
export function useOutsideClick(target: Ref<HTMLElement | null>, handler: () => void, exceptSelector?: string) {
  const onClick = (event: MouseEvent) => {
    const node = event.target as Node | null
    if (!node || target.value?.contains(node)) return
    if (exceptSelector && (node as Element).closest?.(exceptSelector)) return
    handler()
  }
  onMounted(() => document.addEventListener('click', onClick))
  onBeforeUnmount(() => document.removeEventListener('click', onClick))
}
