import { execSync } from "node:child_process";
import path from "node:path";
import agrumePlugin from "@agrume/plugin/vite";
import reactPlugin from "@vitejs/plugin-react";
import { glob } from "glob";
import { defineConfig } from "vite";
import agrumeConfig from "./agrume.config";
import packageJson from "./package.json";

export default defineConfig({
  build: {
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: ["src/main.ts"],
      name: packageJson.name,
      formats: ["es"],
    },
    rollupOptions: {
      input: glob.sync(path.resolve(__dirname, "src/**/*"), {
        absolute: false,
        nodir: true,
      }),
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: ({ facadeModuleId, name: fileName }) => {
          if (facadeModuleId === null) {
            return fileName;
          }
          const relative = path.relative("src", facadeModuleId).replace("[", "\\[").replace("]", "\\]").replace(/\.(t|j)sx?/, ".js");
          if (relative.startsWith("..")) {
            return fileName;
          }
          return relative;
        }
      },
      external: (_id, importer) => {
        return importer !== undefined;
      },
    },
  },
  plugins: [
    agrumePlugin(agrumeConfig as never),
    reactPlugin(),
    {
      name: 'copy-assets',
      apply: 'build',
      writeBundle() {
        for (const file of glob.sync(path.resolve(__dirname, "src/**/*"), {
          nodir: true,
        })) {
          if (file.endsWith(".ts") || file.endsWith(".tsx")) {
            continue;
          }

          const dest = file.replace("src/", "dist/");
          execSync(`mkdir -p ${path.dirname(dest)}`);
          execSync(`cp ${file} ${dest}`);
        }
      },
    },
    {
      name: 'rename-escaped-brackets',
      closeBundle() {
        execSync("find dist -depth -name '*\\[*\\]*' -execdir bash -c 'mv \"$1\" \"${1//\\\\}\"' bash {} \\;");
      }
    },
  ],
});
