import { includeIgnoreFile } from "@eslint/compat";
import css from "@eslint/css";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import { defineConfig } from "eslint/config";
import globals from "globals";
import { fileURLToPath } from "node:url";
import tseslint from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended.filter((conf) => conf.files),
  ...eslintPluginAstro.configs["jsx-a11y-recommended"].filter(
    (conf) => conf.files,
  ),
  {
    extends: [
      ...eslintPluginAstro.configs.recommended.filter((conf) => !conf.files),
      ...eslintPluginAstro.configs["jsx-a11y-recommended"].filter(
        (conf) => !conf.files,
      ),
    ],
    files: ["**/*.astro"],
  },
  { settings: { react: { version: "detect" } } },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  {
    extends: [eslintPluginPrettier],
    ignores: ["**/*.md"],
  },
]);
