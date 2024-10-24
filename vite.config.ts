import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import { vercelPreset } from '@vercel/remix/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { remixDevTools } from 'remix-development-tools'

installGlobals()

export default defineConfig({
  plugins: [
    remixDevTools(),
    remix({ presets: [vercelPreset()] }),
    tsconfigPaths(),
  ],
})
