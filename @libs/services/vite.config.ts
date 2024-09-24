import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import packageJson from './package.json'

export default defineConfig({
  build: {
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
