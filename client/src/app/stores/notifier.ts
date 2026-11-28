import { defineStore } from 'pinia'

export interface Toast {
  id: number
  text: string
  kind: 'success' | 'error'
}

const VISIBLE_FOR_MS = 5000
let nextId = 1

// Messages shown in the top right corner (the AngularJS site used toastr for the same).
export const useNotifier = defineStore('notifier', {
  state: () => ({ toasts: [] as Toast[] }),
  actions: {
    push(text: string, kind: Toast['kind']) {
      const id = nextId++
      this.toasts.push({ id, text, kind })
      setTimeout(() => this.dismiss(id), VISIBLE_FOR_MS)
    },
    success(text: string) {
      this.push(text, 'success')
    },
    error(text: string) {
      this.push(text, 'error')
    },
    dismiss(id: number) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    },
  },
})
