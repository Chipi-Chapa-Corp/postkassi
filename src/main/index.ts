import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow } from "electron";
import { handleIpcs } from "./ipc";
import { handleDebug } from "./ipc/debug";
import { createWindow } from "./window";

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("org.chipichapa.postkassi");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	handleIpcs({
		debug: handleDebug,
	});

	const loadWindow = await createWindow();

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
