import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow } from "electron";
import { handleIpc, handleIpcs, makeIpcSender } from "./ipc";
import { handleDebug } from "./ipc/debug";
import {
	handleWindowClose,
	handleWindowIsMaximized,
	handleWindowMaximize,
	handleWindowMinimize,
	handleWindowUnmaximize,
} from "./ipc/window";
import { createWindow } from "./window";

function setupMessaging(mainWindow: BrowserWindow) {
	const sendIpc = makeIpcSender(mainWindow);

	mainWindow.on("maximize", () => sendIpc("windowMaximizedChanged", true));
	mainWindow.on("unmaximize", () => sendIpc("windowMaximizedChanged", false));

	handleIpcs({
		debug: handleDebug,
	});

	handleIpc("windowMinimize", handleWindowMinimize);
	handleIpc("windowMaximize", handleWindowMaximize);
	handleIpc("windowUnmaximize", handleWindowUnmaximize);
	handleIpc("windowClose", handleWindowClose);
	handleIpc("windowIsMaximized", handleWindowIsMaximized);
}

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("org.chipichapa.postkassi");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	const { mainWindow, loadWindow } = await createWindow();

	setupMessaging(mainWindow);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) loadWindow();
	});

	loadWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
