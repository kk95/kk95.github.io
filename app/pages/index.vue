<script setup lang="ts">
import { leadProjects, milestones, moreWork, service, sideProjects, stack } from '~/data/projects'

const nav = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Day to day' },
  { id: 'work', label: 'Work' },
  { id: 'contributions', label: 'Contributions' },
  { id: 'side-projects', label: 'Side projects' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'outside', label: 'Outside work' },
]
const links = [
  { href: 'mailto:kshitijkarke@gmail.com', label: 'kshitijkarke@gmail.com' },
  { href: 'https://www.linkedin.com/in/kshitij-karke', label: 'LinkedIn' },
  { href: 'https://github.com/kk95', label: 'GitHub' },
]
// Recently built features, shown up front instead of counts.
const glance = [
  { title: 'Agents from forms', body: 'Branching intake forms write each AI phone agent\'s prompt.', project: 'AI voice intake platform' },
  { title: 'A reviewer with memory', body: 'Claude agents review PRs and remember each repo\'s settled decisions.', project: 'AI PR reviewer' },
  { title: 'Invoice scanner', body: 'Pulls line items out of vendor invoices for ops, every day.', project: 'Operations platform' },
]

// Wide screens start with everything up front in a centered header. Once it
// scrolls away, a sidebar slides in on the left and the content shifts right.
const DOCK_MIN_WIDTH = 1000
const hero = ref<HTMLElement>()
const docked = ref(false)
// Narrower screens get a slim sticky bar instead, once the header scrolls away.
const showBar = ref(false)
const active = ref('about')
const bar = ref<HTMLElement>()

function onScroll() {
  const wide = window.innerWidth >= DOCK_MIN_WIDTH
  const heroGone = hero.value!.getBoundingClientRect().bottom < 140
  docked.value = wide && heroGone
  showBar.value = !wide && heroGone
  // Highlight the last section whose top has passed 40% of the screen.
  const line = window.innerHeight * 0.4
  let current = nav[0]!.id
  for (const n of nav) {
    const top = document.getElementById(n.id)?.getBoundingClientRect().top
    if (top !== undefined && top <= line) current = n.id
  }
  active.value = current
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  onScroll()
})
// Keep the active section's chip in view in the phone bar.
watch(active, (id) => {
  bar.value?.querySelector(`[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div class="page" :class="{ docked }">
    <div class="phone-bar" :class="{ show: showBar }" :inert="!showBar">
      <a href="#about" class="bar-name">
        <img src="/images/kk-headshot.jpg" alt="" width="32" height="32">
        <span>Kshitij "KK" Karke</span>
      </a>
      <nav ref="bar" aria-label="Sections">
        <a v-for="n in nav" :key="n.id" :href="`#${n.id}`" :data-id="n.id" :class="{ active: active === n.id }">{{ n.label }}</a>
      </nav>
    </div>

    <aside class="rail" :inert="!docked">
      <div class="avatar rail-avatar">
        <picture>
          <source srcset="/images/kk-headshot.webp" type="image/webp">
          <img src="/images/kk-headshot.jpg" alt="" width="480" height="480">
        </picture>
      </div>
      <p class="rail-name">Kshitij "KK" Karke</p>
      <p class="role">Software engineer at Spill Center</p>
      <p class="tagline muted">AI products and the internal tools around them.</p>
      <nav aria-label="Sections">
        <a v-for="n in nav" :key="n.id" :href="`#${n.id}`" :class="{ active: active === n.id }">{{ n.label }}</a>
      </nav>
      <ul class="links">
        <li v-for="l in links" :key="l.href"><a :href="l.href">{{ l.label }}</a></li>
      </ul>
      <LucySlideshow class="rail-lucy" />
    </aside>

    <main class="content">
      <header ref="hero" class="hero">
        <div class="hero-top">
          <div>
            <p class="eyebrow mono">Software engineer · Spill Center · since 2019</p>
            <h1>Kshitij "KK" Karke</h1>
          </div>
          <div class="avatar">
            <picture>
              <source srcset="/images/kk-headshot.webp" type="image/webp">
              <img src="/images/kk-headshot.jpg" alt="Kshitij Karke" width="480" height="480">
            </picture>
          </div>
        </div>
        <p class="lede">I build AI products and the internal tools around them, end to end, working agent-first in Claude Code.</p>
        <p class="glance-label mono">Recently built</p>
        <ul class="glance">
          <li v-for="g in glance" :key="g.title">
            <strong>{{ g.title }}</strong>
            <span>{{ g.body }}</span>
            <small class="mono">{{ g.project }}</small>
          </li>
        </ul>
        <div class="hero-foot">
          <ul class="links row">
            <li v-for="l in links" :key="l.href"><a :href="l.href">{{ l.label }}</a></li>
          </ul>
          <nav class="row" aria-label="Sections">
            <a v-for="n in nav" :key="n.id" :href="`#${n.id}`">{{ n.label }}</a>
          </nav>
        </div>
      </header>

      <section id="about" v-reveal class="about">
        <h2>About</h2>
        <p>Hi, I'm KK. I've been a software engineer at Spill Center since 2019, and these days I build AI products and the internal tools around them, usually end to end: talking with the people who need it, designing the screens, writing the code, shipping it and demoing it.</p>
        <p>I work agent-first. Most of my day runs through Claude Code, with agy (the Antigravity CLI) as a second agent: I plan and review in agent sessions, ship bigger features as stacked PRs, and write ADRs when a decision needs a paper trail. Lately I've also been building the tools that help a whole team work this way, like our AI code reviewer and a shared AI setup.</p>
      </section>

      <section id="stack">
        <h2 v-reveal>Day to day</h2>
        <div class="stack">
          <div v-for="(g, i) in stack" :key="g.group" v-reveal="i * 70" class="stack-group">
            <h3 class="mono">{{ g.group }}</h3>
            <ul class="chips">
              <li v-for="item in g.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="work">
        <h2 v-reveal>Selected work</h2>
        <LeadProject v-for="p in leadProjects" :key="p.id" :project="p" />
        <ul class="small-grid">
          <li v-for="(w, i) in moreWork" :key="w.name" v-reveal="i * 90" class="small card-lift">
            <h3>{{ w.name }}</h3>
            <p>{{ w.body }}</p>
            <span class="mono muted">{{ w.meta }}</span>
          </li>
        </ul>
      </section>

      <section id="contributions">
        <h2 v-reveal>Contributions by project</h2>
        <ContributionChart v-reveal />
      </section>

      <section id="side-projects">
        <h2 v-reveal>Side projects</h2>
        <ul class="small-grid two">
          <li v-for="(s, i) in sideProjects" :key="s.name" v-reveal="i * 90" class="small card-lift">
            <h3>{{ s.name }}</h3>
            <p>{{ s.body }}</p>
            <span class="mono muted">{{ s.meta }}</span>
            <a v-if="s.link" class="visit" :href="s.link.href">{{ s.link.label }} <span class="arrow">→</span></a>
          </li>
        </ul>
      </section>

      <section id="timeline">
        <h2 v-reveal>Timeline</h2>
        <ol class="timeline">
          <li v-for="(m, i) in milestones" :key="m.date + m.text" v-reveal="i * 60">
            <span class="mono muted">{{ m.date }}</span>
            <span>{{ m.text }}</span>
          </li>
        </ol>
      </section>

      <section id="outside">
        <h2 v-reveal>Outside work</h2>
        <div v-for="(g, i) in service" :key="g.org" v-reveal="i * 80" class="service">
          <h3>{{ g.org }}</h3>
          <ul>
            <li v-for="r in g.roles" :key="r.date + r.text">
              <span class="mono muted">{{ r.date }}</span>
              <span>{{ r.text }}</span>
            </li>
          </ul>
        </div>
        <LucySlideshow class="inline-lucy" />
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Page frame: 1240px max. The content column is centered until the header
   docks, then moves right to make room for the 260px rail plus a 56px gap. */
.page { --rail: 260px; --gap: 56px; --col: 800px; max-width: 1240px; margin: 0 auto; padding: 0 32px 96px; }
.content {
  width: min(100%, var(--col));
  margin-left: calc((100% - min(100%, var(--col))) / 2);
  transition: margin-left 0.7s var(--ease-out), width 0.7s var(--ease-out);
}
.page.docked .content { width: calc(100% - var(--rail) - var(--gap)); margin-left: calc(var(--rail) + var(--gap)); }
.content > section { padding-top: 8px; margin-bottom: 72px; scroll-margin-top: 24px; }

/* First glance: name, a one-line pitch, three numbers, links and nav. */
.hero { position: relative; padding: 96px 0 72px; margin-bottom: 24px; transition: opacity 0.5s var(--ease-out); }
.page.docked .hero { opacity: 0; }
.hero > * { animation: rise 0.9s var(--ease-out) both; }
.hero > :nth-child(2) { animation-delay: 0.1s; }
.hero > :nth-child(3) { animation-delay: 0.2s; }
.hero > :nth-child(4) { animation-delay: 0.32s; }
.hero > :nth-child(5) { animation-delay: 0.4s; }
.hero-top { display: flex; align-items: center; justify-content: space-between; gap: 32px; margin-bottom: 20px; }
.hero-top h1 { margin-bottom: 0; }

/* The photo keeps its own layer above the rest of the header. */
.avatar { position: relative; z-index: 41; flex: none; width: 190px; height: 190px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, var(--blob-1), var(--blob-2)); transition: transform 0.4s var(--ease-out); }
.avatar:hover { transform: scale(1.04) rotate(-2deg); }
.avatar img { display: block; width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 4px solid var(--bg); }
.avatar.rail-avatar { width: 72px; height: 72px; margin-bottom: 14px; }
.eyebrow { color: var(--ink-3); text-transform: uppercase; font-size: 0.72rem; margin-bottom: 14px; }
h1 { font-size: clamp(2.4rem, 6vw, 3.6rem); letter-spacing: -0.01em; margin-bottom: 16px; }
.lede { font-size: 1.2rem; color: var(--ink-2); max-width: 46ch; margin-bottom: 32px; }
.glance { list-style: none; padding: 0; margin: 0 0 32px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.glance li { border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; background: color-mix(in srgb, var(--surface) 70%, transparent); display: flex; flex-direction: column; gap: 4px; transition: border-color 0.3s, transform 0.35s var(--ease-out); }
.glance li:hover { border-color: color-mix(in srgb, var(--accent) 45%, var(--line)); transform: translateY(-2px); }
.glance-label { color: var(--ink-3); text-transform: uppercase; font-size: 0.7rem; margin: 0 0 10px; }
.glance strong { font: 600 1.15rem/1.25 var(--serif); color: var(--accent); }
.glance span { font-size: 0.85rem; color: var(--ink-2); flex: 1; }
.glance small { font-size: 0.68rem; color: var(--ink-3); margin-top: 6px; }

/* Phone bar: slides down once the header is gone, like the rail does on wide screens. */
.phone-bar { display: none; }
@media (max-width: 999px) {
  .phone-bar {
    display: block; position: fixed; inset: 0 0 auto 0; z-index: 42;
    padding: 8px 16px 0; background: color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
    transform: translateY(-110%); transition: transform 0.45s var(--ease-out);
  }
  .phone-bar.show { transform: none; }
  .bar-name { display: flex; align-items: center; gap: 10px; color: var(--ink); background-image: none; font: 600 0.95rem var(--serif); }
  .bar-name img { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; border: 2px solid var(--accent); }
  .phone-bar nav { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding: 8px 0 10px; margin: 0 -16px; padding-inline: 16px; }
  .phone-bar nav::-webkit-scrollbar { display: none; }
  .phone-bar nav a { flex: none; font-size: 0.82rem; color: var(--ink-2); background: var(--surface); background-image: none; border: 1px solid var(--line); border-radius: 999px; padding: 5px 12px; transition: color 0.25s, border-color 0.25s, background-color 0.25s; }
  .phone-bar nav a.active { color: var(--bg); background-color: var(--accent); border-color: var(--accent); }
  .content > section { scroll-margin-top: 100px; }
}
.hero-foot { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 32px; padding-top: 20px; border-top: 1px solid var(--line); }
.row { display: flex; flex-wrap: wrap; gap: 6px 18px; list-style: none; padding: 0; margin: 0; font-size: 0.92rem; }
.hero nav a { color: var(--ink-2); background-image: none; }
.hero nav a:hover { color: var(--accent); }

/* The rail waits off to the right and slightly up, so docking reads as the
   header sliding over to the left. */
.rail {
  position: fixed; top: 40px; left: max(32px, calc((100vw - 1240px) / 2 + 32px)); width: var(--rail);
  z-index: 41; opacity: 0; transform: translate(90px, -20px); pointer-events: none;
  transition: opacity 0.45s var(--ease-out), transform 0.7s var(--ease-out);
}
.page.docked .rail { opacity: 1; transform: none; pointer-events: auto; }
.rail-name { font: 600 2rem/1.2 var(--serif); margin: 0 0 10px; }
.role { font-weight: 500; margin-bottom: 4px; }
.tagline { font-size: 0.95rem; }
.rail nav { display: flex; flex-direction: column; gap: 4px; margin: 20px 0; padding: 16px 0; border-block: 1px solid var(--line); }
.rail nav a { position: relative; padding-left: 16px; color: var(--ink-3); background-image: none; font-size: 0.95rem; transition: color 0.25s, transform 0.35s var(--ease-out); }
.rail nav a::before { content: ''; position: absolute; left: 0; top: 50%; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); transform: translateY(-50%) scale(0); transition: transform 0.35s var(--ease-out); }
.rail nav a:hover { color: var(--ink); }
.rail nav a.active { color: var(--ink); transform: translateX(4px); }
.rail nav a.active::before { transform: translateY(-50%) scale(1); }
.links { list-style: none; padding: 0; margin: 0; font-size: 0.9rem; display: grid; gap: 4px; justify-items: start; }
.links.row { display: flex; gap: 6px 18px; }
.rail-lucy { margin-top: 20px; }
/* Lucy fills what's left of the rail's height: the rail's content above her ends
   around 630px down and her title and caption take ~110px, and the 4:5 photo's
   width is 0.8 of its height. Only very short windows move her under Outside work. */
.rail-lucy { width: clamp(110px, calc((100vh - 760px) * 0.8), 200px); }
.inline-lucy { display: none; max-width: 280px; margin-top: 28px; }
@media (max-height: 899px) { .rail-lucy { display: none; } .inline-lucy { display: block; } }

.about p { font-size: 1.08rem; max-width: 64ch; }

.stack { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px 28px; }
.stack-group h3 { font-size: 0.72rem; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; }
.stack .chips li { font-size: 0.8rem; padding: 6px 10px; transition: transform 0.25s var(--ease-out), background 0.25s; }
.stack .chips li:hover { transform: translateY(-2px); background: color-mix(in srgb, var(--accent) 22%, var(--accent-soft)); }

.small-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.small-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.small { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 8px; }
.small h3 { font-size: 1.05rem; }
.small p { color: var(--ink-2); font-size: 0.92rem; margin: 0; flex: 1; }
.visit { font-weight: 500; font-size: 0.9rem; align-self: flex-start; }
.arrow { display: inline-block; transition: transform 0.3s var(--ease-out); }
.visit:hover .arrow { transform: translateX(4px); }

.timeline { list-style: none; padding: 0; margin: 0; border-left: 2px solid var(--line); }
.timeline li { display: grid; grid-template-columns: 90px minmax(0, 1fr); gap: 16px; padding: 8px 0 8px 20px; position: relative; }
.timeline li::before { content: ''; position: absolute; left: -6px; top: 16px; width: 10px; height: 10px; border-radius: 50%; background: var(--surface); border: 2px solid var(--accent); transition: background 0.3s; }
.timeline li:hover::before { background: var(--accent); }

.service + .service { margin-top: 28px; }
.service h3 { font-size: 1.05rem; margin-bottom: 8px; }
.service ul { list-style: none; padding: 0; margin: 0; }
.service li { display: grid; grid-template-columns: 110px minmax(0, 1fr); gap: 16px; padding: 4px 0; color: var(--ink-2); }

/* Below 1000px there's no rail; the header stays at the top. */
@media (max-width: 999px) {
  .rail { display: none; }
  .inline-lucy { display: block; }
  .content, .page.docked .content { width: 100%; margin-left: 0; }
}
@media (max-width: 720px) {
  .page { padding: 0 16px 72px; }
  /* Phones: a centered header that fits one screen; the feature cards swipe sideways. */
  .hero { padding: 32px 0 36px; text-align: center; }
  .hero-top { flex-direction: column; align-items: center; gap: 16px; margin-bottom: 12px; }
  .hero-top .avatar { order: -1; width: min(48vw, 190px); height: min(48vw, 190px); }
  .lede { margin: 0 auto 24px; font-size: 1.05rem; }
  .glance { display: grid; grid-auto-flow: column; grid-template-columns: none; grid-auto-columns: 78%; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; margin: 0 -16px 24px; padding: 0 16px 4px; text-align: left; }
  .glance::-webkit-scrollbar { display: none; }
  .glance li { scroll-snap-align: center; }
  .hero-foot { justify-content: center; }
  .hero-foot nav { display: none; }
  .small-grid, .small-grid.two { grid-template-columns: minmax(0, 1fr); }
  .timeline li, .service li { grid-template-columns: minmax(0, 1fr); gap: 2px; }
  .content > section { margin-bottom: 56px; }
}
</style>
