import { BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { handleIpc } from ".";

function getWindow(event: IpcMainInvokeEvent) {
	return BrowserWindow.fromWebContents(event.sender);
}

export async function handleWindowMinimize(event: IpcMainInvokeEvent) {
	getWindow(event)?.minimize();
}

export async function handleWindowMaximize(event: IpcMainInvokeEvent) {
	getWindow(event)?.maximize();
}

export async function handleWindowUnmaximize(event: IpcMainInvokeEvent) {
	getWindow(event)?.unmaximize();
}

export async function handleWindowClose(event: IpcMainInvokeEvent) {
	getWindow(event)?.close();
}

export async function handleWindowIsMaximized(event: IpcMainInvokeEvent) {
	return getWindow(event)?.isMaximized() ?? false;
}

export function handleWindowIpcs(): void {
	handleIpc("windowMinimize", handleWindowMinimize);
	handleIpc("windowMaximize", handleWindowMaximize);
	handleIpc("windowUnmaximize", handleWindowUnmaximize);
	handleIpc("windowClose", handleWindowClose);
	handleIpc("windowIsMaximized", handleWindowIsMaximized);
}
