import { createStitches } from "@stitches/react";

export const {
	styled,
	css,
	globalCss,
	keyframes,
	getCssText,
	theme: darkTheme,
	createTheme,
	config,
} = createStitches({
	theme: {
		colors: {
			background: "#1d1d20",

			itemBackground: "#38383b",
			itemHoverBackground: "#434346",

			text: "#ffffff",
			textDisabled: "#808080",
		},
		space: {
			xs: "4px",
			sm: "8px",
			md: "16px",
			lg: "32px",
			xl: "64px",
		},
		radii: {
			xs: "4px",
			sm: "8px",
			md: "16px",
			lg: "32px",
			xl: "64px",
		},
	},
});

export const applyGlobalStyles = globalCss({
	"*": {
		margin: 0,
		padding: 0,
		boxSizing: "border-box",
	},
});
