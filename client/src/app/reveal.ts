import type { Directive } from 'vue'

// `v-reveal`: the element fades and slides in once, when it scrolls into view. Does nothing (the element is simply
// there) for visitors who prefer reduced motion and in browsers without IntersectionObserver.
export const vReveal: Directive<HTMLElement> = {
  mounted(el) {
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    ) {
      return
    }
    el.classList.add('reveal')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        el.classList.add('reveal--visible')
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(el)
  },
}
