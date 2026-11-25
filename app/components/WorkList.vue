<script setup lang="ts">
import { workProjects } from '~/data/projects'

// Selected work as rows that open one at a time or all together. Open state is a
// data attribute because v-reveal adds a class to these rows,
// and a reactive :class would wipe them.
const openIds = ref(new Set<string>())
const mounted = ref(false)
onMounted(() => { mounted.value = true })

const allOpen = computed(() => openIds.value.size === workProjects.length)

function toggle(id: string) {
  const next = new Set(openIds.value)
  if (!next.delete(id)) next.add(id)
  openIds.value = next
}
function toggleAll() {
  openIds.value = new Set(allOpen.value ? [] : workProjects.map(p => p.id))
}
</script>

<template>
  <div v-reveal class="work-head">
    <h2>Selected work</h2>
    <button class="toggle-all mono" @click="toggleAll">{{ allOpen ? 'collapse all' : 'expand all' }}</button>
  </div>

  <ul class="work-list">
    <li
      v-for="(p, i) in workProjects" :key="p.id" v-reveal="i * 70"
      class="work-row card-lift" :data-open="openIds.has(p.id) || undefined"
    >
      <h3>
        <button
          :id="`work-${p.id}`" class="row-button"
          :aria-expanded="openIds.has(p.id)" :aria-controls="`work-panel-${p.id}`"
          @click="toggle(p.id)"
        >
          <span class="row-text">
            <span class="row-title">
              <span class="name">{{ p.name }}</span>
              <span class="dates mono">{{ p.dates }}</span>
            </span>
            <span class="pitch">{{ p.pitch }}</span>
          </span>
          <svg class="chevron" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
            <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </h3>

      <!-- Closed panels are inert once JS runs, so keyboard users skip what they can't see. -->
      <div
        :id="`work-panel-${p.id}`" class="work-panel" role="region"
        :aria-labelledby="`work-${p.id}`" :inert="mounted && !openIds.has(p.id)"
      >
        <div class="panel-clip">
          <div class="panel-body">
            <p v-if="p.why" class="why">{{ p.why }}</p>
            <dl v-if="p.stats?.length" class="stats">
              <div v-for="s in p.stats" :key="s.label">
                <dt class="mono">{{ s.label }}</dt>
                <dd>{{ s.value }}</dd>
              </div>
            </dl>
            <ul v-if="p.features?.length" class="features">
              <li v-for="f in p.features" :key="f.title">
                <h4>{{ f.title }}</h4>
                <p>{{ f.body }}</p>
              </li>
            </ul>
            <ul class="chips" aria-label="Stack">
              <li v-for="s in p.stack" :key="s">{{ s }}</li>
            </ul>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.work-head { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; margin-bottom: 1.25rem; }
.work-head h2 { margin: 0; }
.toggle-all { flex: none; padding: 4px 0; border: 0; background: none; color: var(--ink-3); cursor: pointer; transition: color 0.2s; }
.toggle-all:hover { color: var(--accent); }

.work-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
.work-row { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; }
.work-row h3 { font: inherit; margin: 0; }

.row-button {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; gap: 16px;
  width: 100%; padding: 16px 20px; border: 0; border-radius: 12px; background: none;
  color: inherit; font: inherit; text-align: left; cursor: pointer;
}
.row-text { display: grid; gap: 4px; min-width: 0; }
.row-title { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 2px 16px; }
.name { font: 600 1.2rem/1.25 var(--serif); }
.dates { color: var(--ink-3); }
.pitch { color: var(--ink-2); font-size: 0.92rem; line-height: 1.5; }
.chevron { color: var(--ink-3); transition: transform 0.35s var(--ease-out), color 0.2s; }
.row-button:hover .chevron { color: var(--accent); }
[data-open] .chevron { transform: rotate(180deg); color: var(--accent); }

/* Animating the row track from 0fr to 1fr slides to the content's real height. */
.work-panel { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.4s var(--ease-out); }
.panel-clip { min-height: 0; overflow: hidden; }
.panel-body { padding: 2px 20px 20px; }

.why { color: var(--ink-2); font-size: 0.95rem; }
.stats { display: flex; flex-wrap: wrap; gap: 12px 40px; margin: 14px 0 18px; padding: 12px 0; border-block: 1px solid var(--line); }
.stats div { display: flex; flex-direction: column; }
.stats dt { order: 2; color: var(--ink-3); font-size: 0.72rem; }
.stats dd { margin: 0; font: 600 1.4rem/1.2 var(--serif); }
.features { list-style: none; padding: 0; margin: 16px 0 18px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px 28px; }
.features h4 { font: 600 0.95rem var(--sans); margin: 0 0 4px; }
.features p { color: var(--ink-2); font-size: 0.9rem; margin: 0; }

@media (max-width: 640px) {
  .row-button { padding: 14px 16px; gap: 10px; }
  .row-title { flex-direction: column; }
  .panel-body { padding: 2px 16px 16px; }
  .features { grid-template-columns: minmax(0, 1fr); }
}
</style>
