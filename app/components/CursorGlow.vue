<script setup lang="ts">
// One soft color glow for the whole page. It rests behind my name, follows the
// cursor while it moves (the second shape trails behind the first), and drifts
// back home after a short pause or when the cursor leaves the window.
// On touch screens, or with reduced motion, it just stays home.
const props = defineProps<{ home?: HTMLElement | null }>()

const IDLE_MS = 2500
// Share of the remaining distance covered each frame: lower is slower.
// Following the cursor is gentle; drifting back home is slower still.
const FOLLOW = { lead: 0.035, trail: 0.018 }
const RETURN = { lead: 0.014, trail: 0.009 }

const lead = ref<HTMLElement>()
const trail = ref<HTMLElement>()
const leadPos = { x: 0, y: 0 }
const trailPos = { x: 0, y: 0 }
let pointer: { x: number, y: number } | null = null
let idleTimer: ReturnType<typeof setTimeout> | undefined
let frame = 0
let placed = false
let reduceMotion = false

function homePoint() {
  const box = props.home?.getBoundingClientRect()
  return box ? { x: box.left + box.width / 2, y: box.top + box.height / 2 } : { x: window.innerWidth * 0.3, y: 160 }
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

function tick() {
  const target = pointer ?? homePoint()
  if (!placed || reduceMotion) {
    Object.assign(leadPos, target)
    Object.assign(trailPos, target)
    placed = true
  }
  const ease = pointer ? FOLLOW : RETURN
  leadPos.x += (target.x - leadPos.x) * ease.lead
  leadPos.y += (target.y - leadPos.y) * ease.lead
  trailPos.x += (target.x - trailPos.x) * ease.trail
  trailPos.y += (target.y - trailPos.y) * ease.trail
  lead.value!.style.transform = `translate3d(${leadPos.x}px, ${leadPos.y}px, 0)`
  trail.value!.style.transform = `translate3d(${trailPos.x + 70}px, ${trailPos.y + 40}px, 0)`
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseout', onLeaveWindow)
  }
  frame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  clearTimeout(idleTimer)
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('mouseout', onLeaveWindow)
})
</script>

<template>
  <div class="cursor-glow" aria-hidden="true">
    <span ref="trail" class="orb"><span class="blob b" /></span>
    <span ref="lead" class="orb"><span class="blob a" /></span>
  </div>
</template>

<style scoped>
/* Sits over the page and lightens what's under it (screen blend), so text the
   cursor passes over picks up a colored glow without losing contrast. */
.cursor-glow { position: fixed; inset: 0; z-index: 40; pointer-events: none; mix-blend-mode: screen; opacity: var(--blob-opacity); overflow: hidden; }
.orb { position: absolute; left: 0; top: 0; will-change: transform; }
.blob { display: block; width: 260px; height: 240px; margin: -120px 0 0 -130px; border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%; filter: blur(48px); }
.a { background: var(--blob-1); animation: drift-a 15s ease-in-out infinite alternate; }
.b { background: var(--blob-2); animation: drift-b 11s ease-in-out infinite alternate; }
@keyframes drift-a { to { transform: translate(30px, 16px) rotate(50deg) scale(1.15); } }
@keyframes drift-b { to { transform: translate(-24px, -10px) rotate(-35deg) scale(0.9); } }
</style>
