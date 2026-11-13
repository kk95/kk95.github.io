// Builds app/data/contributions.json: my commits per day, grouped by project.
// Runs on my Mac because most of the repos are private work repos. The output
// holds only project labels and daily counts, never repo names, messages or code.
//
// Usage: node scripts/collect-contributions.mjs
// The repo-to-project map lives in scripts/projects.local.json (gitignored,
// since repo names include client names). See projects.example.json.
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const config = JSON.parse(readFileSync(join(root, 'scripts/projects.local.json'), 'utf8'))
const reposDir = config.reposDir.replace(/^~/, homedir())
const authorPattern = config.authors.map(a => a.replace(/[.]/g, '\\.')).join('\\|')

const projects = config.projects.map(({ id, label, kind, repos }) => {
  // A commit can show up on several branches; count each hash once.
  const dayByHash = new Map()
  for (const repo of repos) {
    const dir = join(reposDir, repo)
    if (!existsSync(join(dir, '.git'))) {
      console.warn(`skipped ${id}: one repo is not cloned locally`)
      continue
    }
    const log = execFileSync('git', ['-C', dir, 'log', '--all', '--no-merges', `--author=${authorPattern}`, '--format=%H %ad', '--date=short'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    for (const line of log.split('\n').filter(Boolean)) {
      const [hash, day] = line.split(' ')
      dayByHash.set(hash, day)
    }
  }
  const days = {}
  for (const day of dayByHash.values()) days[day] = (days[day] ?? 0) + 1
  const sortedDays = Object.fromEntries(Object.entries(days).sort(([a], [b]) => a.localeCompare(b)))
  return { id, label, kind, total: dayByHash.size, activeDays: Object.keys(days).length, days: sortedDays }
})

const allDays = projects.flatMap(p => Object.keys(p.days)).sort()
const out = { generated: new Date().toISOString().slice(0, 10), from: allDays[0], to: allDays.at(-1), projects }
writeFileSync(join(root, 'app/data/contributions.json'), JSON.stringify(out))
for (const p of projects) console.log(`${p.label}: ${p.total} commits on ${p.activeDays} days`)
