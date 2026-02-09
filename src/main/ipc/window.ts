import { BrowserWindow, type IpcMainInvokeEvent } from "electron";
import { handleIpc } from ".";

function getWindow(event: IpcMainInvokeEvent) {
	return BrowserWindow.fromWebContents(event.sender);
}

async function handleWindowMinimize(event: IpcMainInvokeEvent) {
	getWindow(event)?.minimize();
}

async function handleWindowMaximize(event: IpcMainInvokeEvent) {
	getWindow(event)?.maximize();
}

async function handleWindowUnmaximize(event: IpcMainInvokeEvent) {
	getWindow(event)?.unmaximize();
}

async function handleWindowClose(event: IpcMainInvokeEvent) {
	getWindow(event)?.close();
}

async function handleWindowIsMaximized(event: IpcMainInvokeEvent) {
	return getWindow(event)?.isMaximized() ?? false;
}

export function handleWindowIpcs(): void {
	handleIpc("windowMinimize", handleWindowMinimize);
	handleIpc("windowMaximize", handleWindowMaximize);
	handleIpc("windowUnmaximize", handleWindowUnmaximize);
	handleIpc("windowClose", handleWindowClose);
	handleIpc("windowIsMaximized", handleWindowIsMaximized);
}
