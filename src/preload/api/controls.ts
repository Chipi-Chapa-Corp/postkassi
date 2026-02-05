import { type IpcRendererEvent, ipcRenderer } from "electron";
import { makeTitlebarLayoutApi } from "./titlebar";

function onIsMaximizedChange(callback: (isMaximized: boolean) => void) {
	const listener = (_event: IpcRendererEvent, value: boolean) =>
		callback(value);

	ipcRenderer.on("windowMaximizedChanged", listener);
	return () => ipcRenderer.removeListener("windowMaximizedChanged", listener);
}

export async function createControlsApi() {
	return {
		titlebarLayout: makeTitlebarLayoutApi(),
		getIsMaximized: () => ipcRenderer.invoke("windowIsMaximized"),
		onIsMaximizedChange,
		minimize: () => ipcRenderer.invoke("windowMinimize"),
		maximize: () => ipcRenderer.invoke("windowMaximize"),
		unmaximize: () => ipcRenderer.invoke("windowUnmaximize"),
		close: () => ipcRenderer.invoke("windowClose"),
	};
}

export type ControlsAPI = Awaited<ReturnType<typeof createControlsApi>>;
