<script setup lang="ts">
// The cursor companion: an ink creature modeled on the inky bird in Gris
// ("The Animation in Gris", 9:18-9:50). A soft glow body with two ink strands chases the cursor; the strands
// taper off like smoke, their front ends flap like wings on a choppy 12 fps beat
// (Gris runs its animations slower than its movement, 3:16-4:44), and fast moves
// shed specks of ink. When the cursor rests it flies back and hovers behind my
// name. It flies behind the page, so it never covers text; cards it passes
// under get an ink stain where it is (.ink-react in main.css).
// With reduced motion it just rests behind my name.
const props = defineProps<{ home?: HTMLElement | null }>()

const IDLE_MS = 2500
// The head moves on a spring, so it glides, overshoots a little and settles
// instead of braking dead. pull: how hard the target tugs; damp: velocity kept per frame.
const FOLLOW = { pull: 0.012, damp: 0.88 }
const RETURN = { pull: 0.004, damp: 0.92 }
// While the cursor is still, the bird circles it lazily instead of stopping.
const CIRCLE = { x: 18, y: 10 }
const LINKS = 30
// How tightly each trail point follows the one ahead of it.
const ROPE = 0.24
const FLAP_FPS = 12
const WING_SPAN = 30
// How many trail points from the head the wings reach back over.
const WING_LINKS = 11
const STRANDS = [
  { color: '--blob-2', width: 14, side: -1, wobble: 0, alpha: 0.38 },
  { color: '--blob-1', width: 9, side: 1, wobble: Math.PI / 2, alpha: 0.45 },
]
const MAX_SPECKS = 36
// The soft glow body under the strands: a yellow blob at the head and a red one
// further back along the trail, so the red lags behind like the old glow did.
const BODY = [
  { color: '--blob-2', at: 10, radius: 180, alpha: 0.28 },
  { color: '--blob-1', at: 0, radius: 150, alpha: 0.34 },
]

interface Point { x: number, y: number }
interface Speck extends Point { vx: number, vy: number, r: number, life: number }

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D
let colors: Record<string, { solid: string, clear: string }> = {}
let trail: Point[] = []
const velocity = { x: 0, y: 0 }
let specks: Speck[] = []
let pointer: Point | null = null
let idleTimer: ReturnType<typeof setTimeout> | undefined
let frame = 0
let reduceMotion = false
let cards: HTMLElement[] = []

function homePoint(now: number): Point {
  const box = props.home?.getBoundingClientRect()
  const base = box ? { x: box.left + box.width * 0.55, y: box.top + box.height / 2 } : { x: window.innerWidth * 0.3, y: 160 }
  if (reduceMotion) return base
  // Resting: a slow lazy loop, like the bird hovering in place.
  return { x: base.x + Math.sin(now / 1300) * 34, y: base.y + Math.cos(now / 900) * 12 }
}

function onMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  pointer = { x: e.clientX, y: e.clientY }
  clearTimeout(idleTimer)
  idleTimer = setTimeout(() => { pointer = null }, IDLE_MS)
}
function onLeaveWindow(e: MouseEvent) {
  if (!e.relatedTarget) pointer = null
}

// Turns any CSS color (the build shortens #ffcc00 to #fc0) into solid and
// fully transparent rgba strings, by letting the canvas normalize it to #rrggbb.
function rgbOf(cssColor: string) {
  ctx.fillStyle = cssColor.trim()
  const hex = ctx.fillStyle as string
  const [r, g, b] = [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16))
  return { solid: `rgba(${r}, ${g}, ${b}, 1)`, clear: `rgba(${r}, ${g}, ${b}, 0)` }
}

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const c = canvas.value!
  c.width = window.innerWidth * dpr
  c.height = window.innerHeight * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  cards = [...document.querySelectorAll<HTMLElement>('.ink-react')]
}

function step(now: number) {
  const target = pointer
    ? { x: pointer.x + Math.sin(now / 700) * CIRCLE.x, y: pointer.y + Math.cos(now / 550) * CIRCLE.y }
    : homePoint(now)
  if (!trail.length) trail = Array.from({ length: LINKS }, () => ({ ...target }))
  const head = trail[0]!
  const before = { ...head }
  if (reduceMotion) {
    Object.assign(head, target)
  }
  else {
    const spring = pointer ? FOLLOW : RETURN
    velocity.x = (velocity.x + (target.x - head.x) * spring.pull) * spring.damp
    velocity.y = (velocity.y + (target.y - head.y) * spring.pull) * spring.damp
    head.x += velocity.x
    head.y += velocity.y
  }
  for (let i = 1; i < LINKS; i++) {
    trail[i]!.x += (trail[i - 1]!.x - trail[i]!.x) * ROPE
    trail[i]!.y += (trail[i - 1]!.y - trail[i]!.y) * ROPE
  }
  // Fast moves shed ink from the tail, which drifts up and fades like smoke.
  const speed = Math.hypot(head.x - before.x, head.y - before.y)
  const tail = trail[LINKS - 1]!
  if (!reduceMotion && speed > 3 && specks.length < MAX_SPECKS && Math.random() < 0.35) {
    specks.push({ x: tail.x, y: tail.y, vx: (Math.random() - 0.5) * 0.8, vy: -0.25 - Math.random() * 0.5, r: 1 + Math.random() * 2.5, life: 1 })
  }
  specks = specks.filter(s => (s.life -= 0.016) > 0)
  for (const s of specks) { s.x += s.vx; s.y += s.vy }
}

function draw(now: number) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  // Wings flap on their own 12 fps beat, so they read as hand-drawn frames.
  const beat = Math.floor(now / (1000 / FLAP_FPS))
  const flap = reduceMotion ? 0.6 : Math.sin(beat * 0.85)
  for (const blob of BODY) {
    const p = trail[blob.at]!
    const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blob.radius)
    // Fade to the same color at zero alpha; plain 'transparent' leaves a dark ring.
    glow.addColorStop(0, colors[blob.color]!.solid)
    glow.addColorStop(1, colors[blob.color]!.clear)
    ctx.globalAlpha = blob.alpha
    ctx.fillStyle = glow
    ctx.fillRect(p.x - blob.radius, p.y - blob.radius, blob.radius * 2, blob.radius * 2)
  }
  for (const strand of STRANDS) {
    const left: Point[] = []
    const right: Point[] = []
    for (let i = 0; i < LINKS; i++) {
      const a = trail[Math.max(i - 1, 0)]!
      const b = trail[Math.min(i + 1, LINKS - 1)]!
      // Normal to the trail; a trail sitting perfectly still falls back to vertical.
      const len = Math.hypot(a.x - b.x, a.y - b.y)
      const nx = len < 0.001 ? 0 : -(a.y - b.y) / len
      const ny = len < 0.001 ? 1 : (a.x - b.x) / len
      const t = i / (LINKS - 1)
      const taper = (1 - t) ** 1.3
      const wing = strand.side * WING_SPAN * Math.sin(Math.min(i / WING_LINKS, 1) * Math.PI) * (0.3 + 0.7 * flap)
      const wobble = Math.sin(i * 0.55 + now / 260 + strand.wobble) * 5 * t
      const cx = trail[i]!.x + nx * (wing + wobble)
      const cy = trail[i]!.y + ny * (wing + wobble)
      const w = (strand.width * taper) / 2 + 0.4
      left.push({ x: cx + nx * w, y: cy + ny * w })
      right.push({ x: cx - nx * w, y: cy - ny * w })
    }
    ctx.beginPath()
    ctx.moveTo(left[0]!.x, left[0]!.y)
    for (const p of left) ctx.lineTo(p.x, p.y)
    for (const p of right.reverse()) ctx.lineTo(p.x, p.y)
    ctx.closePath()
    ctx.fillStyle = colors[strand.color]!.solid
    ctx.shadowColor = colors[strand.color]!.solid
    ctx.shadowBlur = 8
    ctx.globalAlpha = strand.alpha
    ctx.fill()
  }
  ctx.shadowBlur = 0
  for (const s of specks) {
    ctx.globalAlpha = s.life * 0.35
    ctx.fillStyle = colors['--blob-2']!.solid
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.r * (1.6 - s.life * 0.6), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

// Cards under the bird's head get an ink stain at its position (read all the
// rects first, then write, so the browser lays out once per frame).
function stainCards() {
  const head = trail[0]!
  const hits = cards.map((el) => {
    const r = el.getBoundingClientRect()
    return { el, r, inside: head.x >= r.left && head.x <= r.right && head.y >= r.top && head.y <= r.bottom }
  })
  for (const { el, r, inside } of hits) {
    if (inside) {
      el.style.setProperty('--ix', `${head.x - r.left}px`)
      el.style.setProperty('--iy', `${head.y - r.top}px`)
      el.style.setProperty('--tx', `${((head.x - r.left) / r.width - 0.5) * 2}`)
      el.style.setProperty('--ty', `${((head.y - r.top) / r.height - 0.5) * 2}`)
    }
    el.classList.toggle('inked', inside)
  }
}

function tick(now: number) {
  step(now)
  draw(now)
  if (!reduceMotion) stainCards()
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  ctx = canvas.value!.getContext('2d')!
  const css = getComputedStyle(document.documentElement)
  colors = Object.fromEntries(['--blob-1', '--blob-2'].map(v => [v, rgbOf(css.getPropertyValue(v))]))
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  resize()
  window.addEventListener('resize', resize)
  if (!reduceMotion) {
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseout', onLeaveWindow)
  }
  frame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(idleTimer)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('mouseout', onLeaveWindow)
})
</script>

<template>
  <canvas ref="canvas" class="ink-bird" aria-hidden="true" />
</template>

<style scoped>
/* Behind the page: it never covers text. The page content sits at z-index 1
   (index.vue), so the bird shows in the open background and passes under cards. */
.ink-bird { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
</style>
