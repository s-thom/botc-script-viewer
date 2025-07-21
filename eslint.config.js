import css from "@eslint/css";
import js from "@eslint/js";
import markdown from "@eslint/markdown";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
// import pluginReact from "eslint-plugin-react";
// import * as reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
import { includeIgnoreFile } from "@eslint/compat";
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
  // pluginReact.configs.flat.recommended,
  // pluginReact.configs.flat["jsx-runtime"],
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
  // reactHooks.configs["recommended-latest"],
  // reactRefresh.configs.vite,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
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
