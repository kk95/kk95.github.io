// Static site for GitHub Pages: `nuxt generate` prerenders everything to .output/public.
export default defineNuxtConfig({
  compatibilityDate: '2025-08-01',
  devtools: { enabled: false },
  css: ['~/assets/css/colors.css', '~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Kshitij "KK" Karke',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Kshitij "KK" Karke, software engineer building AI products and the internal tools around them.' },
      ],
      // Marks that JS is on before first paint, so scroll reveals can start hidden
      // without hiding anything for people who have JS off.
      script: [{ innerHTML: "document.documentElement.classList.add('js')" }],
      link: [
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap' },
      ],
    },
  },
})
