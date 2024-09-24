import { defineConfig } from "vite";
import reactPlugin from "@vitejs/plugin-react";
import agrumePlugin from "@agrume/plugin/vite";
import path from "node:path";
import { glob } from "glob";
import { execSync } from "node:child_process";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: ["src/main.ts"],
      name: packageJson.name,
      formats: ["es"],
    },
    rollupOptions: {
      input: glob.sync(path.resolve(__dirname, "src/**/*"), {
        nodir: true,
      }),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: ({ name: fileName }) => `${fileName}.js`,
      },
      external: (_id, importer) => {
        return importer !== undefined;
      },
    },
  },
  plugins: [
    agrumePlugin(),
    reactPlugin(),
    {
      name: 'copy-assets',
      apply: 'build',
      writeBundle() {
        glob.sync(path.resolve(__dirname, "src/**/*"), {
          nodir: true,
        }).filter((file) => !file.endsWith(".ts") && !file.endsWith(".tsx")).forEach((file) => {
          const dest = file.replace("src/", "dist/");
          execSync(`mkdir -p ${path.dirname(dest)}`);
          execSync(`cp ${file} ${dest}`);
        });
      },
    },
  ],
});
