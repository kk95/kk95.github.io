// Chips remember where the pointer came in, so their color bloom (main.css)
// starts from that spot.
export default defineNuxtPlugin(() => {
  if (!import.meta.client) return
  document.addEventListener('pointerover', (e) => {
    const chip = (e.target as Element).closest?.<HTMLElement>('.chips li')
    if (!chip || chip.contains(e.relatedTarget as Node)) return
    const box = chip.getBoundingClientRect()
    chip.style.setProperty('--x', `${e.clientX - box.left}px`)
    chip.style.setProperty('--y', `${e.clientY - box.top}px`)
  })
})
