import { electronAPI } from "@electron-toolkit/preload";
import { findArgument } from "@shared/arguments";
import { contextBridge } from "electron";
import type { TitlebarLayout } from "../main/titlebar";

const titlebarLayout = findArgument<TitlebarLayout>(
	"titlebarLayout",
	process.argv,
);

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("titlebarLayout", titlebarLayout);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-expect-error (define in dts)
	window.electron = electronAPI;
	// @ts-expect-error (define in dts)
	window.titlebarLayout = titlebarLayout;
}
