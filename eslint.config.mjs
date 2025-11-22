import globals from "globals";
import pluginJs from "@eslint/js";
import { configs as tseslint } from "typescript-eslint";
import prettierlint from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import { configs as pluginStorybook } from "eslint-plugin-storybook";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginPreferArrows from "eslint-plugin-prefer-arrow-functions";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import { flatConfigs as pluginImportX } from "eslint-plugin-import-x";
import pluginRouter from "@tanstack/eslint-plugin-router";
import checkFile from "eslint-plugin-check-file";
import filenameExport from "eslint-plugin-filename-export";

/**
 * ==========================================================
 * 🔧 ESLint Configuration — Carvajal Consultants Standard
 * ==========================================================
 *
 * **Real-world purpose:**
 * - Guarantees a consistent coding style across all of our apps and packages.
 * - Enforces strict filename and folder naming conventions matching TanStack Start.
 * - Integrates seamlessly with React, TypeScript, Storybook, and Prettier.
 * - Provides guardrails for scalable monorepos where readability and consistency matter.
 * 
 * **Guiding principles:**
 * - Every file must reflect its purpose in naming and structure.
 * - All apps share the same base quality rules to ensure predictability.
 * - Developers can open any file in the monorepo and instantly understand its context.
 */

// ==========================================================
// 🔠 Base Regular Expressions for TanStack Start Naming Rules
// Based on https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing
// Regex rules are partly from: https://github.com/dukeluo/eslint-plugin-check-file/blob/main/lib/constants/naming-convention.js
// ==========================================================

/**
 * camelCase or PascalCase segment
 * @example productId, UserProfile
 */
export const CAMEL_CASE = '+([a-z])*([a-z0-9])*([A-Z]*([a-z0-9]))';

/**
 * kebab-case segment
 * @example user-profile, admin, team
 */
export const KEBAB_CASE = '+([a-z])*([a-z0-9])*(-+([a-z0-9]))';

/**
 * Dynamic route segments
 * @example $id, $productId
 */
export const TANSTACK_DYNAMIC_SEGMENTS = `\\$${CAMEL_CASE}`;

/**
 * Optional dynamic route segments
 * @example $id?, $.slug
 */
export const TANSTACK_OPTIONAL_SEGMENTS = `\\$(?:${CAMEL_CASE}\\?|\\.${CAMEL_CASE})`;

/**
 * Catch-all route segment
 * @example $.tsx
 */
export const TANSTACK_CATCH_ALL_SEGMENTS = `\\$`;

/**
 * Grouped routes inside parentheses
 * @example (admin), (user-profile)
 */
export const TANSTACK_ROUTE_GROUPS = `\\(${KEBAB_CASE}\\)`;

/**
 * Private folders prefixed with underscore
 * @example _components, _utils
 */
export const TANSTACK_PRIVATE_FOLDERS = `\\_${CAMEL_CASE}`;

/**
 * Static route segment
 * @example about, userProfile, team-page
 */
export const TANSTACK_STATIC_ROUTE = `(?:${KEBAB_CASE}|${CAMEL_CASE})`;

/**
 * Full route segment pattern (TanStack Start compatible)
 */
export const TANSTACK_ROUTE_SEGMENT = `@(${TANSTACK_STATIC_ROUTE}|${TANSTACK_DYNAMIC_SEGMENTS}|${TANSTACK_OPTIONAL_SEGMENTS}|${TANSTACK_CATCH_ALL_SEGMENTS}|${TANSTACK_ROUTE_GROUPS}|${TANSTACK_PRIVATE_FOLDERS})`;

/**
 * Valid filenames (before .tsx)
 */
export const TANSTACK_FILENAME_CASE = `@(index|route|${TANSTACK_STATIC_ROUTE}|${TANSTACK_DYNAMIC_SEGMENTS}|${TANSTACK_OPTIONAL_SEGMENTS}|${TANSTACK_CATCH_ALL_SEGMENTS}|${TANSTACK_ROUTE_GROUPS}|${TANSTACK_PRIVATE_FOLDERS})`;

/**
 * Valid folder names for TanStack routing
 */
export const TANSTACK_FOLDER_CASE = `@(${TANSTACK_STATIC_ROUTE}|${TANSTACK_DYNAMIC_SEGMENTS}|${TANSTACK_OPTIONAL_SEGMENTS}|${TANSTACK_CATCH_ALL_SEGMENTS}|${TANSTACK_ROUTE_GROUPS}|${TANSTACK_PRIVATE_FOLDERS})`;

// ==========================================================
// 🧱 Base Configuration Stack
// ==========================================================

export default [
  // 1️⃣ Ignore patterns for generated files
  {
    ignores: [
      "**/styled-system/",
      "**/routeTree.gen.ts",
      "**/gql",
      "**/.vinxi",
      "**/.output",
      "**/*.config.{ts,mjs,cjs}",
      "**/.storybook/**/*.{ts,js}",
      "**/postcss.config.cjs",
    ],
  },

  // 2️⃣ Scope files to lint (apps and packages)
  {
    files: ["apps/**/*.{ts,tsx}", "packages/**/*.{ts,tsx}"],
  },

  // 3️⃣ Global parser + environment setup
  {
    settings: {
      react: { version: "19.0" },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 4️⃣ Extend from shared best practices
  prettierlint,
  pluginJs.configs.recommended,
  ...tseslint.recommendedTypeChecked,
  ...tseslint.stylisticTypeChecked,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...pluginStorybook["flat/recommended"],
  pluginReactRefresh.configs.recommended,
  pluginImportX.recommended,
  pluginImportX.typescript,
  ...pluginRouter.configs["flat/recommended"],

  // ==========================================================
  // 🧠 Core Project Rules
  // ==========================================================
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "import-x/no-default-export": "error",

      // TanStack redirects need throw redirect() to work
      "@typescript-eslint/only-throw-error": "off",
    },
  },

  // Allow default exports only where strictly needed
  {
    files: [
      "**/*.stories.tsx",
      "**/*.config.ts",
      "**/ssr.tsx",
      "**/api.ts",
    ],
    rules: {
      "import-x/no-default-export": "off",
    },
  },

  // React hooks safety
  {
    plugins: { "react-hooks": pluginReactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Prefer arrow functions for all callbacks and exports
  {
    plugins: { "prefer-arrow-functions": pluginPreferArrows },
    rules: {
      "prefer-arrow-functions/prefer-arrow-functions": [
        "error",
        { returnStyle: "implicit" },
      ],
      "prefer-arrow-callback": ["error", { allowNamedFunctions: false }],
      "func-style": ["error", "expression", { allowArrowFunctions: false }],
    },
  },

  // ==========================================================
  // 📂 FILE + DIRECTORY NAMING CONVENTIONS (CCI Standard)
  // ==========================================================
  {
    plugins: {
      "check-file": checkFile,
      "filename-export": filenameExport,
    },

    rules: {
      /**
       * Folder naming: enforce kebab-case everywhere.
       * Real-world purpose:
       * - Prevents confusion between folder and component naming.
       * - Keeps routing tree predictable and URL-safe.
       */
      "check-file/folder-naming-convention": [
        "error",
        {
          // Routes: allow TanStack folder patterns
          "apps/*/app/routes/**": TANSTACK_FOLDER_CASE,

          // App folders: strict kebab-case
          "apps/*/": "KEBAB_CASE",

          // Packages: strict kebab-case
          "packages/**/": "KEBAB_CASE",
        },
      ],

      /**
       * Filename rules based on file purpose.
       * Ensures every file’s name matches its intent (React components, hooks, utils, etc.).
       */
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/app/components/**/*.tsx": "PASCAL_CASE",
          "**/app/plugins/*.ts": "PASCAL_CASE",
          "**/app/styles/*.css": "KEBAB_CASE",
          "**/app/**/hooks/*.ts": "CAMEL_CASE",
          "**/app/utils/*.ts": "CAMEL_CASE",
          "**/packages/components/**/*.tsx": "PASCAL_CASE",
          "**/packages/utils/*.ts": "CAMEL_CASE",
        },
      ],

      /**
       * Enforce filename-default-export parity.
       * Ensures that a file’s exported component name matches its filename.
       * Real-world goal:
       * - Promotes readability and traceability across large codebases.
       * - Avoids mismatched imports like `import User from './Profile.tsx'`.
       */
      "filename-export/match-default-export": [
        "error",
        {
          casing: "strict",
          stripextra: true,
        },
      ],
    },
  },
];

