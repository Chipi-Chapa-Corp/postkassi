import type { CssProperties } from "@renderer/styled-system/types";

export const draggable = {
	["-webkit-app-region" as keyof CssProperties]: "drag",
};

export const nonDraggable = {
	["-webkit-app-region" as keyof CssProperties]: "no-drag",
};
