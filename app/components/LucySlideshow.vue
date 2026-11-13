<script setup lang="ts">
// Crossfading photos of Lucy with a caption for each. Pauses while hovered;
// the dots jump to a photo.
const photos = [
  { src: 'lucy-1', date: 'Oct 2020', caption: 'Front row on the patio ledge.', alt: 'Lucy, a small long-haired chihuahua, smiling on a stone ledge in a purple harness' },
  { src: 'lucy-2', date: 'Jan 2023', caption: 'Post-bath burrito mode.', alt: 'Lucy wrapped in a mint towel after a bath' },
  { src: 'lucy-3', date: 'Sep 2023', caption: 'Belly up. Do not disturb.', alt: 'Lucy sprawled belly-up on a mint blanket' },
  { src: 'lucy-4', date: 'Jan 2024', caption: 'Winter fit: plaid hoodie and booties.', alt: 'Lucy in a blue plaid hoodie and little black booties' },
  { src: 'lucy-5', date: 'Apr 2024', caption: 'Glasses on for the solar eclipse.', alt: 'Lucy wearing round glasses outside during the April 2024 solar eclipse' },
  { src: 'lucy-6', date: 'Apr 2025', caption: 'Sunbathing in the dandelions.', alt: 'Lucy sitting in green grass dotted with dandelions' },
  { src: 'lucy-7', date: 'May 2025', caption: 'Walking through the spring petals.', alt: 'Lucy on a path covered in pink blossom petals' },
  { src: 'lucy-8', date: 'Sep 2025', caption: 'Big yawn from the car seat.', alt: 'Lucy yawning in her car seat carrier' },
  { src: 'lucy-9', date: 'May 2026', caption: 'Sharing the couch with Mizu. Barely.', alt: 'Lucy on a couch below Mizu, a black and white cat, in a pet bed' },
  { src: 'lucy-10', date: 'Aug 2026', caption: 'Room with a view.', alt: 'Lucy smiling on a carpet in front of a window with a city skyline' },
]
const SLIDE_MS = 4000

const index = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    if (!paused.value) index.value = (index.value + 1) % photos.length
  }, SLIDE_MS)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <figure class="lucy" @mouseenter="paused = true" @mouseleave="paused = false">
    <p class="title">Lucy, my chihuahua</p>
    <div class="frame">
      <picture v-for="(p, i) in photos" :key="p.src" :class="{ shown: i === index }">
        <source :srcset="`/images/lucy/${p.src}.webp`" type="image/webp">
        <img :src="`/images/lucy/${p.src}.jpg`" :alt="p.alt" width="480" height="600" :loading="i === 0 ? 'eager' : 'lazy'">
      </picture>
    </div>
    <figcaption>
      <Transition name="caption" mode="out-in">
        <q :key="index">{{ photos[index]!.caption }}</q>
      </Transition>
      <span class="meta">
        <span class="mono">{{ photos[index]!.date }}</span>
        <span class="dots">
          <button
            v-for="(p, i) in photos" :key="p.src" :aria-label="`Show photo ${i + 1}`" :aria-pressed="i === index"
            @click="index = i"
          />
        </span>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.lucy { margin: 0; }
.frame { position: relative; aspect-ratio: 4 / 5; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); background: var(--surface); }
picture { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s var(--ease-out); }
picture.shown { opacity: 1; }
img { width: 100%; height: 100%; object-fit: cover; display: block; transform: scale(1.06); transition: transform 2.8s ease-out; }
picture.shown img { transform: scale(1); }
.title { font: 600 0.95rem var(--serif); color: var(--ink); margin: 0 0 8px; }
figcaption { margin-top: 8px; font-size: 0.82rem; color: var(--ink-2); }
q { display: block; font-style: italic; min-height: 2.6em; }
.meta { display: flex; justify-content: space-between; align-items: center; gap: 8px; white-space: nowrap; margin-top: 4px; color: var(--ink-3); font-size: 0.72rem; }
.caption-enter-active, .caption-leave-active { transition: opacity 0.4s, transform 0.4s var(--ease-out); }
.caption-enter-from { opacity: 0; transform: translateY(4px); }
.caption-leave-to { opacity: 0; transform: translateY(-4px); }
.dots { display: flex; gap: 4px; }
.dots button { width: 6px; height: 6px; padding: 0; border: 0; border-radius: 50%; background: var(--line); cursor: pointer; transition: background 0.3s, transform 0.3s var(--ease-out); }
.dots button[aria-pressed="true"] { background: var(--accent); transform: scale(1.3); }
</style>
