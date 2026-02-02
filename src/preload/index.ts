import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge } from "electron";
import { createAppApi } from "./api";

const appAPI = await createAppApi();

if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("app", appAPI);
	} catch (error) {
		console.error(error);
	}
} else {
	// @ts-expect-error (define in dts)
	window.electron = electronAPI;
	// @ts-expect-error (define in dts)
	window.app = appAPI;
}
