import js from "@eslint/js";
import tseslint from "typescript-eslint";
import html from "eslint-plugin-html";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default tseslint.config(
	{
		ignores: [
			"Docs/",
			"Dist/",
			"Release/",
			"TestData/",
			"TestData*.txt/",
			"node_modules/",
			"VIVA/",
			".claude/",
			"*.js",
			"*.mjs"
		]
	},
	js.configs.recommended,
	tseslint.configs.recommended,
	prettierRecommended,
	{
		files: ["**/*.ts", "**/*.tsx", "**/*.html"],
		plugins: { html },
		languageOptions: {
			globals: { ...globals.browser, ...globals.node, ...globals.jest }
		},
		rules: {
			"@typescript-eslint/explicit-function-return-type": "error",
			// Warn until the `any` types from the strict-TS migration are burned down.
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/naming-convention": [
				"error",
				{
					selector: "variable",
					format: ["camelCase", "UPPER_CASE"]
				},
				{
					selector: "function",
					format: ["PascalCase"]
				},
				{
					selector: "parameter",
					format: ["camelCase"],
					leadingUnderscore: "allow"
				},
				{
					selector: "class",
					format: ["PascalCase"]
				}
			],
			complexity: ["warn", { max: 10 }],
			"max-lines": ["warn", { max: 500, skipComments: true }],
			"prettier/prettier": [
				"error",
				{
					endOfLine: "auto",
					printWidth: 80,
					useTabs: true,
					semi: true,
					singleQuote: false,
					trailingComma: "none"
				}
			]
		}
	}
);
