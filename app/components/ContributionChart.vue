<script setup lang="ts">
import data from '~/data/contributions.json'

type View = 'year' | 'all'
interface Cell { label: string, count: number }

const view = ref<View>('year')
const showTable = ref(false)
const tooltip = ref<{ x: number, y: number, text: string } | null>(null)

const DAY_MS = 86_400_000
const WEEKS_IN_YEAR_VIEW = 53
const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`)
const end = toDate(data.generated)

// Columns for the current view: weeks (Monday starts) or calendar months.
const columns = computed(() => {
  if (view.value === 'year') {
    const monday = new Date(end.getTime() - ((end.getUTCDay() + 6) % 7) * DAY_MS)
    return Array.from({ length: WEEKS_IN_YEAR_VIEW }, (_, i) => {
      const start = new Date(monday.getTime() - (WEEKS_IN_YEAR_VIEW - 1 - i) * 7 * DAY_MS)
      return { start, label: `week of ${dayFmt.format(start)}`, tick: start.getUTCDate() <= 7 && start.getUTCMonth() % 3 === 0 ? start.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) : '' }
    })
  }
  const first = toDate(data.from)
  const cols = []
  for (let d = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1)); d <= end; d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1)))
    cols.push({ start: d, label: monthFmt.format(d), tick: d.getUTCMonth() === 0 ? String(d.getUTCFullYear()) : '' })
  return cols
})

// Index of the column a day falls in, or -1 when it's outside the view.
function columnOf(day: Date) {
  const cols = columns.value
  if (day < cols[0]!.start) return -1
  if (view.value === 'year') return Math.floor((day.getTime() - cols[0]!.start.getTime()) / (7 * DAY_MS))
  return (day.getUTCFullYear() - cols[0]!.start.getUTCFullYear()) * 12 + day.getUTCMonth() - cols[0]!.start.getUTCMonth()
}

const rows = computed(() => data.projects.map((p) => {
  const counts = new Array(columns.value.length).fill(0)
  for (const [iso, n] of Object.entries(p.days)) {
    const i = columnOf(toDate(iso))
    if (i >= 0 && i < counts.length) counts[i] += n
  }
  const cells: Cell[] = counts.map((count, i) => ({ count, label: columns.value[i]!.label }))
  return { ...p, cells, viewTotal: counts.reduce((a, b) => a + b, 0) }
}).filter(r => view.value === 'all' || r.viewTotal > 0))

// Shade steps come from quartiles of the non-empty cells, so a few huge weeks
// don't wash every other week out to the lightest step.
const thresholds = computed(() => {
  const counts = rows.value.flatMap(r => r.cells.map(c => c.count)).filter(n => n > 0).sort((a, b) => a - b)
  const q = (f: number) => counts[Math.floor(f * (counts.length - 1))] ?? 1
  return [q(0.25), q(0.5), q(0.75)]
})
const level = (n: number) => n === 0 ? 0 : 1 + thresholds.value.filter(t => n > t).length

const groups = computed(() => [
  { title: 'Work', rows: rows.value.filter(r => r.kind === 'work') },
  { title: 'Side projects', rows: rows.value.filter(r => r.kind === 'side') },
].filter(g => g.rows.length))

const grandTotal = computed(() => rows.value.reduce((a, r) => a + r.viewTotal, 0))
const unit = computed(() => view.value === 'year' ? 'week' : 'month')
const sinceLabel = monthFmt.format(toDate(data.from))

// Year totals for the table view, newest first.
const years = computed(() => {
  const ys = new Set(data.projects.flatMap(p => Object.keys(p.days).map(d => d.slice(0, 4))))
  return [...ys].sort().reverse()
})
const yearTotal = (days: Record<string, number>, y: string) =>
  Object.entries(days).filter(([d]) => d.startsWith(y)).reduce((a, [, n]) => a + n, 0)

function showTip(e: MouseEvent, row: { label: string }, cell: Cell) {
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const plural = cell.count === 1 ? 'commit' : 'commits'
  tooltip.value = { x: box.left + box.width / 2, y: box.top, text: `${row.label} · ${cell.label} · ${cell.count} ${plural}` }
}
</script>

<template>
  <div class="chart">
    <div class="controls">
      <div class="segmented" role="group" aria-label="Time range">
        <button :aria-pressed="view === 'year'" @click="view = 'year'">Last 12 months</button>
        <button :aria-pressed="view === 'all'" @click="view = 'all'">Since {{ sinceLabel }}</button>
      </div>
      <button class="link-button" :aria-pressed="showTable" @click="showTable = !showTable">
        {{ showTable ? 'Show chart' : 'Show as table' }}
      </button>
    </div>

    <p class="summary">
      <strong>{{ grandTotal.toLocaleString() }}</strong> commits across {{ rows.length }} projects
      {{ view === 'year' ? 'in the last 12 months' : `since ${sinceLabel}` }}.
    </p>

    <div v-if="!showTable" class="scroller">
      <div :key="view" class="grid" :class="view" :style="{ '--cols': columns.length }">
        <template v-for="g in groups" :key="g.title">
          <div class="group-title mono">{{ g.title }}</div>
          <div v-for="r in g.rows" :key="r.id" class="row">
            <div class="row-label">{{ r.label }}</div>
            <div class="cells" @mouseleave="tooltip = null">
              <span
                v-for="(c, i) in r.cells" :key="i"
                class="cell" :data-level="level(c.count)" :style="{ '--i': i }"
                @mouseenter="showTip($event, r, c)"
              />
            </div>
            <div class="row-total mono">{{ r.viewTotal.toLocaleString() }}</div>
          </div>
        </template>
        <div class="row axis" aria-hidden="true">
          <div class="row-label" />
          <div class="cells">
            <span v-for="(c, i) in columns" :key="i" class="tick mono">{{ c.tick }}</span>
          </div>
          <div />
        </div>
      </div>
    </div>

    <div v-else class="scroller">
      <table class="table">
        <caption class="sr-only">Commits per project per year</caption>
        <thead>
          <tr><th scope="col">Project</th><th v-for="y in years" :key="y" scope="col">{{ y }}</th><th scope="col">Total</th></tr>
        </thead>
        <tbody>
          <tr v-for="p in data.projects" :key="p.id">
            <th scope="row">{{ p.label }}</th>
            <td v-for="y in years" :key="y">{{ yearTotal(p.days, y) || '–' }}</td>
            <td>{{ p.total.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <div v-if="!showTable" class="legend mono" aria-hidden="true">
        Fewer
        <span v-for="l in 5" :key="l" class="cell" :data-level="l - 1" />
        More commits per {{ unit }}
      </div>
      <p class="note muted">
        My commits from local clones, grouped by project. Most of these repos are private, so this shows counts only. Updated {{ dayFmt.format(end) }}.
      </p>
    </div>

    <div v-if="tooltip" class="tooltip" role="status" :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }">
      {{ tooltip.text }}
    </div>
  </div>
</template>

<style scoped>
.chart { background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 20px; }
.controls { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 14px; }
.segmented { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; padding: 2px; }
.segmented button, .link-button { font: 500 0.85rem var(--sans); border: 0; background: none; color: var(--ink-2); cursor: pointer; }
.segmented button { padding: 6px 12px; border-radius: 6px; transition: background 0.25s, color 0.25s; }
.segmented button[aria-pressed="true"] { background: var(--accent-soft); color: var(--ink); }
.link-button { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; padding: 4px; }
.summary { color: var(--ink-2); margin-bottom: 16px; }
.summary strong { color: var(--ink); font-family: var(--serif); font-size: 1.25rem; }

.scroller { overflow-x: auto; }
.grid { min-width: 560px; }
.grid.all { min-width: 640px; }
.group-title { color: var(--ink-3); text-transform: uppercase; font-size: 0.7rem; margin: 14px 0 6px; }
.group-title:first-child { margin-top: 0; }
.row { display: grid; grid-template-columns: 170px minmax(0, 1fr) 48px; align-items: center; gap: 12px; padding: 3px 0; }
.row-label { font-size: 0.85rem; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.row-total { text-align: right; color: var(--ink-3); }
.cells { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 2px; }
.cell { display: block; height: 16px; border-radius: 3px; background: var(--heat-0); }
.cell[data-level="1"] { background: var(--heat-1); }
.cell[data-level="2"] { background: var(--heat-2); }
.cell[data-level="3"] { background: var(--heat-3); }
.cell[data-level="4"] { background: var(--heat-4); }
/* Cells sweep in left to right when the chart first shows and on each range switch. */
.chart.is-visible .cells .cell { animation: cell-in 0.5s var(--ease-out) both; animation-delay: calc(var(--i, 0) * var(--sweep-step)); }
.grid.year { --sweep-step: 14ms; }
.grid.all { --sweep-step: 7ms; }
@keyframes cell-in { from { opacity: 0; transform: scaleY(0.2); } }
.cell { transition: background 0.6s; }
.cells .cell:hover { outline: 2px solid var(--ink); outline-offset: 1px; }
.axis .cells { height: 16px; }
.tick { font-size: 0.65rem; color: var(--ink-3); white-space: nowrap; overflow: visible; }

.footer { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px 24px; margin-top: 16px; }
.legend { display: flex; align-items: center; gap: 4px; color: var(--ink-3); font-size: 0.7rem; }
.legend .cell { width: 14px; height: 14px; }
.note { font-size: 0.8rem; margin: 0; max-width: 46ch; }

.table { width: 100%; border-collapse: collapse; font-size: 0.85rem; min-width: 560px; }
.table th, .table td { padding: 6px 8px; border-bottom: 1px solid var(--line); text-align: right; font-variant-numeric: tabular-nums; }
.table th[scope="row"], .table thead th:first-child { text-align: left; font-weight: 500; }
.table thead th { color: var(--ink-3); font-weight: 500; }

.tooltip {
  position: fixed; transform: translate(-50%, calc(-100% - 8px));
  background: var(--ink); color: var(--bg); font-size: 0.78rem;
  padding: 6px 10px; border-radius: 6px; pointer-events: none; white-space: nowrap; z-index: 10;
}
@media (max-width: 640px) {
  /* Labels go above their row so a full year of weeks fits on a phone. */
  .grid { min-width: 0; }
  .grid.all { min-width: 560px; }
  .row { grid-template-columns: minmax(0, 1fr) 44px; gap: 2px 10px; padding: 4px 0; }
  .row-label { grid-column: 1 / -1; }
}
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
