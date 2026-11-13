# kk95.github.io

My personal site: selected work, side projects, and a per-project view of my commits. Nuxt 4, generated to static HTML and served by GitHub Pages.

## Run it

```sh
npm install
npm run dev        # http://localhost:3000
npm run generate   # static output in .output/public
```

## Update the contributions chart

The chart reads `app/data/contributions.json`, which holds daily commit counts per project and nothing else. Most of the repos behind it are private, so the file is built on my Mac from local clones, not in CI.

1. Copy `scripts/projects.example.json` to `scripts/projects.local.json` and list which local repos belong to each project. The local file is gitignored because repo names include client names.
2. Run `npm run contributions`, then commit the updated JSON.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repo settings, Pages has to be set to deploy from GitHub Actions.
