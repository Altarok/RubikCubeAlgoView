import tseslint from 'typescript-eslint';
import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import { globalIgnores } from "eslint/config";

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
    plugins: {
      obsidianmd: obsidianmd,
    },
    rules: {
      "obsidianmd/ui/sentence-case": [ "error", {
        "acronyms": ["PLL", "OLL", "F2L", "CFOP"]
      }]
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
