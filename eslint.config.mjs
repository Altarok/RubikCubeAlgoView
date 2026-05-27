import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import obsidianmdPlugin from "eslint-plugin-obsidianmd";
import js from "@eslint/js";

export default [
  // 1. Globale Umgebung definieren (Node/Browser)
  {
    ignores: [
      "coverage/**",
      "main.js"
    ],
  },
  {
    languageOptions: {
      globals: {
        process: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
  },
  // 2. Konfiguration für deine Quellcodedateien
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json", // Zeigt ESLint deine TS-Konfiguration
        tsconfigRootDir: import.meta.dirname, // Setzt den korrekten Basis-Pfad unter Windows/Node
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      "obsidianmd": obsidianmdPlugin,
    },
    rules: {
      // Standard-Empfehlungen aktivieren
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,

      // Obsidian-Empfehlungen aktivieren
      ...obsidianmdPlugin.configs.recommended.rules,


      // switch off 'no-undef'
      "no-undef": "off",

      // personal rules
      // "no-unused-vars": "off",
      // "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
      // "@typescript-eslint/ban-ts-comment": "off"
    },
  },
];
