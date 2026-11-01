import { onScopeDispose, ref, shallowRef } from 'vue'
import { FetchError } from '@shared/api'

let pending = 0
let waiters: (() => void)[] = []

// Resolves once no loader is running, or after `timeout` ms. The router uses it to restore the scroll position of a
// page whose content arrives from the API.
export function whenLoaded(timeout = 3000): Promise<void> {
  if (pending === 0) return Promise.resolve()
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(done, timeout)
    waiters.push(done)
  })
}

function settled() {
  pending--
  if (pending > 0) return
  const resolved = waiters
  waiters = []
  resolved.forEach((resolve) => resolve())
}

// Thrown by loaders for things that exist in the API but are not part of the site (unpublished items).
export class NotFoundError extends Error {}

// Runs a loading function and tracks its state. The spinner stays up for 50ms after the data arrives, as it did on
// the old site, so a fast response does not flash the page.
export function useLoader<T>(load: () => Promise<T>) {
  const data = shallowRef<T>()
  const loading = ref(true)
  const notFound = ref(false)
  const failed = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    settled()
  }

  const run = async () => {
    pending++
    loading.value = true
    notFound.value = false
    failed.value = false
    try {
      data.value = await load()
    } catch (error) {
      data.value = undefined
      if (error instanceof NotFoundError || (error instanceof FetchError && error.status === 404)) notFound.value = true
      else failed.value = true
    } finally {
      timer = setTimeout(() => {
        loading.value = false
        finish()
      }, 50)
    }
  }

  onScopeDispose(() => {
    clearTimeout(timer)
    finish()
  })
  const ready = run()

  return { data, loading, notFound, failed, ready }
}
