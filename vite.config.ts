import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const site = env.SITE_URL?.replace(/\/$/, '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'gift-metadata',
        transformIndexHtml: (html: string) =>
          site && /^https:\/\//.test(site)
            ? html.replace(
                'content="./social-cover.png"',
                `content="${site.replace(/["<>]/g, '')}/social-cover.png"`,
              )
            : html,
      },
    ],
    base: './',
  }
})
