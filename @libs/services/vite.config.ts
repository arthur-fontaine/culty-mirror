import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: packageJson.name,
    },
    rollupOptions: {
      external: (source) => !source.startsWith('.') && !source.startsWith('/') && !source.startsWith('@culty'),
    },
  },
  plugins: [dts()],
})
