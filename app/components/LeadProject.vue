<script setup lang="ts">
import type { LeadProject } from '~/data/projects'

defineProps<{ project: LeadProject }>()
// On phones only the first two features show until this is opened.
const expanded = ref(false)
</script>

<template>
  <article v-reveal class="lead card-lift">
    <header>
      <div class="title-row">
        <h3>{{ project.name }}</h3>
        <span class="mono muted">{{ project.dates }}</span>
      </div>
      <p class="pitch">{{ project.pitch }}</p>
      <p class="why">{{ project.why }}</p>
    </header>

    <dl v-if="project.stats.length" class="stats">
      <div v-for="(s, i) in project.stats" :key="s.label" v-reveal="100 + i * 90">
        <dt class="mono">{{ s.label }}</dt>
        <dd>{{ s.value }}</dd>
      </div>
    </dl>

    <ul class="features" :class="{ expanded }">
      <li v-for="(f, i) in project.features" :key="f.title" v-reveal="150 + i * 70">
        <h4>{{ f.title }}</h4>
        <p>{{ f.body }}</p>
      </li>
    </ul>
    <button v-if="project.features.length > 2" class="more" :aria-expanded="expanded" @click="expanded = !expanded">
      {{ expanded ? 'Show fewer' : `Show all ${project.features.length} features` }}
    </button>

    <ul class="chips" aria-label="Stack">
      <li v-for="s in project.stack" :key="s">{{ s }}</li>
    </ul>
  </article>
</template>

<style scoped>
.lead { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 28px; margin-bottom: 24px; }
.title-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 4px 16px; margin-bottom: 10px; }
h3 { font-size: 1.45rem; }
.pitch { font-size: 1.05rem; margin-bottom: 8px; }
.why { color: var(--ink-2); }

.stats { display: flex; flex-wrap: wrap; gap: 12px 40px; margin: 20px 0 24px; padding: 16px 0; border-block: 1px solid var(--line); }
.stats dt { color: var(--ink-3); font-size: 0.72rem; order: 2; }
.stats div { display: flex; flex-direction: column; }
.stats dd { margin: 0; font: 600 1.5rem/1.2 var(--serif); }

.more { display: none; }
.features { list-style: none; padding: 0; margin: 20px 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 28px; }
.features h4 { font: 600 0.95rem var(--sans); margin: 0 0 4px; }
.features p { color: var(--ink-2); font-size: 0.92rem; margin: 0; }

@media (max-width: 640px) {
  .lead { padding: 20px; }
  .features { grid-template-columns: minmax(0, 1fr); margin-bottom: 12px; }
  .features:not(.expanded) li:nth-child(n + 3) { display: none; }
  .more { display: block; margin: 0 0 18px; padding: 0; border: 0; background: none; color: var(--accent); font: 500 0.88rem var(--sans); cursor: pointer; }
}
</style>
