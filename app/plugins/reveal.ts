// v-reveal fades an element up the first time it scrolls into view.
// The optional value is a delay in ms, for staggering siblings.
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | undefined

  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    getSSRProps: () => ({ class: 'reveal' }),
    mounted(el, { value }) {
      el.classList.add('reveal')
      if (value) el.style.setProperty('--reveal-delay', `${value}ms`)
      observer ??= new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer!.unobserve(entry.target)
        }
      }, { rootMargin: '0px 0px -8% 0px' })
      observer.observe(el)
    },
  })
})
