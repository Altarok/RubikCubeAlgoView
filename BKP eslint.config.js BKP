import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import {globalIgnores} from "eslint/config";

export default tseslint.config(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.js',
            'manifest.json'
          ]
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ['.json']
      },
    },
  },
  ...obsidianmd.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {project: './tsconfig.json'},
    },
    rules: {
      'obsidianmd/ui/sentence-case': [ 'warn',
        {
          brands: ['PLL', 'OLL', "Rubik's Cube"],
          acronyms: ['OK'],
          enforceCamelCaseLower: true,
        },
      ],
    },
  },
  globalIgnores([
    "node_modules",
    "esbuild.config.mjs",
    "eslint.config.js",
    "version-bump.mjs",
    "versions.json",
    "main.js",
    "tests",
    "coverage"
  ]),
);
