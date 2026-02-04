import { defineConfig } from "@pandacss/dev";

export default defineConfig({
	preflight: false,
	include: ["src/renderer/src/**/*.{ts,tsx}"],
	presets: ["@pandacss/preset-base", "@pandacss/preset-panda"],
	jsxFramework: "react",
	conditions: {
		extend: {
			light: '[data-theme="light"] &',
			dark: '[data-theme="dark"] &',
		},
	},
	globalCss: {
		"*": {
			margin: 0,
			padding: 0,
			boxSizing: "border-box",
		},
		"html, body, #root": {
			width: "100%",
			height: "100%",
			backgroundColor: "background",
			color: "text",
		},
	},
	theme: {
		tokens: {
			spacing: {
				xs: { value: "4px" },
				sm: { value: "8px" },
				md: { value: "16px" },
				lg: { value: "32px" },
				xl: { value: "64px" },
			},
			radii: {
				xs: { value: "4px" },
				sm: { value: "8px" },
				md: { value: "16px" },
				lg: { value: "32px" },
				xl: { value: "64px" },
			},
			colors: {
				white: { value: "#ffffff" },
				black: { value: "#000000" },
			}
		},
		semanticTokens: 	{
			colors: {
				background: { value: { base: "#181818", _light: "#ffffff" } },
				itemBackground: { value: { base: "#242424", _light: "#eaeaea" } },
				itemHoverBackground: { value: { base: "#303030", _light: "#efefef" } },
				text: { value: { base: "white", _light: "black" } },
				textDisabled: { value: { base: "#808080", _light: "#808080" } },
			},
		},
	},
	outdir: "src/renderer/src/styled-system",
});
