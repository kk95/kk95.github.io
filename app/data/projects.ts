// Every claim here traces to merged PRs, the resume or a repo README.
// Client names stay off the site.

export interface Feature { title: string, body: string }
export interface Stat { value: string, label: string }
export interface LeadProject {
  id: string
  name: string
  pitch: string
  why: string
  dates: string
  stack: string[]
  stats: Stat[]
  features: Feature[]
}

export const leadProjects: LeadProject[] = [
  {
    id: 'voice',
    name: 'AI voice intake platform',
    pitch: 'A subscription product where AI phone agents run customer intake calls, then hand the right people a clean record of what was said.',
    why: 'I built it nearly solo, from the first commit to production-ready in under a year.',
    dates: 'Nov 2025 – now',
    stack: ['Nuxt 4', 'PostgreSQL', 'Cognito', 'Twilio', 'ElevenLabs', 'Postmark', 'Playwright'],
    stats: [],
    features: [
      { title: 'Agents from forms, not prompts', body: 'Customers build branching intake forms, and the form generates the agent\'s prompt and its data-collection fields. Per-agent LLM settings ship with leak-safe defaults.' },
      { title: 'Calls end to end', body: 'Twilio number management and voice webhooks, ElevenLabs agent sync, post-call webhooks pinned to their environment, and transfers to verified numbers that dial first and bridge on answer.' },
      { title: 'After the call', body: 'Intake history with transcript, audio playback and a timeline. Alert groups with encrypted recipient details email the right people, including partial intakes from transferred calls.' },
      { title: 'Organizations and access', body: 'Organizations, owner, admin and member roles, invites, route-level permissions, and Cognito auth with a signup gate for the pilot.' },
      { title: 'Product shape', body: 'Reworked the information architecture around three core dashboard actions, call activity analytics, and one home for org settings.' },
    ],
  },
  {
    id: 'review',
    name: 'AI PR reviewer',
    pitch: 'A small team of Claude agents that gives every pull request a first review before a teammate looks at it.',
    why: 'Most of our code is now written with AI help, so review is where work waits. This takes the first pass so people spend their review time on design.',
    dates: 'Mar 2026 – now',
    stack: ['Anthropic SDK', 'GitHub Actions', 'GitHub App', 'TypeScript'],
    stats: [
      { value: '6', label: 'company repos use it' },
      { value: '43% → 64%', label: 'thumbs-up in 3 months' },
      { value: '~$0.19', label: 'per review' },
    ],
    features: [
      { title: 'Reviewer, judge, learner', body: 'A reviewer agent drafts findings, a judge filters the noise, and after merge a learner reads what human reviewers said.' },
      { title: 'Per-repo memory', body: 'Settled decisions and false-positive patterns are committed to each repo with confidence scores, so it stops flagging the same thing twice.' },
      { title: 'Knows the ticket', body: 'Pulls the linked ClickUp task into the review, so findings are checked against what the change was for.' },
      { title: 'Runs when asked', body: 'An opt-in /review comment replaced review on every push, which keeps PR threads quiet.' },
      { title: 'Model per agent', body: 'Each agent has its own Claude model setting, so a model upgrade can roll out one agent at a time.' },
    ],
  },
]

export interface SmallProject { name: string, body: string, meta: string, link?: { href: string, label: string } }

export const moreWork: SmallProject[] = [
  { name: 'AI invoice scanner', body: 'Extracts structured line items from vendor invoices with OpenAI vision. Ops uses it daily, with 2,500+ line items parsed.', meta: 'Vue 3 · OpenAI' },
  { name: 'Operations platform', body: 'Spill Center\'s main operations app. I built its operations communication system and have worked across it since 2019.', meta: 'Node · Express · Vue · MySQL' },
  { name: 'Team AI setup', body: 'Shared guardrails, workflows and starter files that engineers opt into from their own AI coding tool.', meta: 'Claude Code' },
]

export const sideProjects: SmallProject[] = [
  {
    name: 'It\'s Beer O\'Clock Somewhere',
    body: 'A world clock that finds where it\'s exactly 5:00 PM in solar time, picks the nearest city and shows what\'s on the local beer menu. Built AI-assisted in Claude Code.',
    meta: 'Nuxt 4 · d3-geo · GitHub Pages',
    link: { href: 'https://5oclock.beer', label: '5oclock.beer' },
  },
  {
    name: 'strch',
    body: 'Your profile and today\'s context in, the shortest stretching routine you\'ll actually do out. A deterministic engine picks the routine, and any model suggestion has to pass the same hard filters.',
    meta: 'Vue 3 · three.js · Cloudflare Workers',
    link: { href: 'https://strch.ing', label: 'strch.ing' },
  },
]

export const milestones = [
  { date: 'Nov 2026', text: 'Started a shared AI setup repo for the engineering team.' },
  { date: 'Sep 2026', text: 'Started strch, a stretching routine builder.' },
  { date: 'Mar 2026', text: 'Built the AI PR reviewer and started 5oclock.beer.' },
  { date: 'Nov 2025', text: 'First commit on the AI voice intake platform.' },
  { date: 'Sep 2024', text: 'Set up automated testing for the operations platform: Vitest unit tests and Playwright end-to-end tests running in GitHub Actions.' },
  { date: 'Jun 2023', text: 'Managed and mentored a group of co-op students, including a Vue 3 rewrite of a client\'s mobile app and a log-search stack.' },
  { date: 'Jun 2022', text: 'Started supporting summer co-op students alongside my own work on client intake and alert templates.' },
  { date: 'Jun 2021', text: 'Project management certificate from Cornell.' },
  { date: 'Aug 2020', text: 'Built the incident dashboard for the ops team, putting an incident\'s timeline, contacts, alerts, intake details and attachments on one page.' },
  { date: 'Sep 2019', text: 'Built dynamic incident intake forms and a location-sorted resource lookup for the incident response team.' },
  { date: 'Mar 2019', text: 'Joined Spill Center as a tech associate, later promoted to software engineer.' },
  { date: 'Jun 2018', text: 'Flex operations supervisor at UPS in Lowell, managing drivers on pickup routes.' },
  { date: 'May 2018', text: 'B.S. in Computer Science from UMass Lowell.' },
]

// The tools I use most days, from the resume's skills section and the repos.
export const stack = [
  { group: 'AI and agents', items: ['Claude Code', 'agy (Antigravity CLI)', 'Anthropic SDK', 'OpenAI API', 'ElevenLabs', 'MCP'] },
  { group: 'Frontend', items: ['TypeScript', 'Vue 3', 'Nuxt 4', 'Tailwind CSS 4', 'Nuxt UI', 'PrimeVue Volt', 'Pinia'] },
  { group: 'Backend and data', items: ['Node.js', 'Express', 'Nitro / H3', 'PostgreSQL', 'MySQL'] },
  { group: 'Cloud and delivery', items: ['AWS Cognito', 'AWS ECS', 'S3 and SES', 'Docker', 'GitHub Actions', 'Playwright', 'Vitest'] },
  { group: 'Integrations', items: ['Twilio', 'Postmark', 'Slack', 'ClickUp'] },
]

// Service outside work, from the civic/leadership resume and the vault's Shipped Log.
export const service = [
  { org: 'Sigma Beta Rho, National Executive Board', roles: [
    { date: '2025 – now', text: 'Executive Vice President. Board operations, planning and fiscal reviews.' },
    { date: '2025', text: 'Vice President of Operations. Convention planning and board communications.' },
    { date: '2019 – 2022', text: 'National VP of Undergraduate Affairs. Chapter requirements, regional conferences, and philanthropy drives for S.O.S. Children\'s Villages.' },
  ] },
  { org: 'Lowell Cultural Council', roles: [
    { date: '2022 – now', text: 'Secretary. I keep the minutes and review grant applications. Last cycle we funded 33 local arts and community projects.' },
  ] },
  { org: 'UMass Lowell', roles: [
    { date: '2017 – 2019', text: 'Sigma Beta Rho chapter president and Northeast regional governor.' },
    { date: '2015 – 2018', text: 'SGA events chair, Greek Council VP and South Asian Student Association president. Started the Greek Life Banquet.' },
  ] },
]
