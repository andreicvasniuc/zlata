import { ref } from 'vue'
import { FetchError } from '@shared/api'
import { useNotify } from './useNotify'

// Runs a request with a busy flag; failures show an error toast (a 401 is handled globally by the redirect to login).
export function useBusy() {
  const busy = ref(false)
  const notify = useNotify()

  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    busy.value = true
    try {
      return await action()
    } catch (error) {
      if (!(error instanceof FetchError && error.status === 401)) notify.error('SOMETHING_WENT_WRONG')
      return undefined
    } finally {
      busy.value = false
    }
  }

  return { busy, run }
}
