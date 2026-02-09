import type { CssProperties } from "@renderer/styled-system/types";

export const draggable = {
	["WebkitAppRegion" as keyof CssProperties]: "drag",
};

export const nonDraggable = {
	["WebkitAppRegion" as keyof CssProperties]: "no-drag",
};
