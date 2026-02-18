import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // IMPORTANT:
  // Use relative base so that /img/... and built assets work even if the site is served under a subpath.
  base: './',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
