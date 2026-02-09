import { electronApp, optimizer } from "@electron-toolkit/utils";
import type dbus from "dbus-next";
import { app, BrowserWindow } from "electron";
import { createSessionBus } from "./goa/bus";
import {
	closeMailContext,
	createMailContext,
	type MailContext,
} from "./imap/context";
import { handleIpcs, makeIpcSender } from "./ipc";
import { handleDebug } from "./ipc/debug";
import { handleMailIpcs } from "./ipc/mail";
import { handleWindowIpcs } from "./ipc/window";
import { createWindow } from "./window";

function setupMessaging(
	mainWindow: BrowserWindow,
	sessionBus: dbus.MessageBus,
	mailContext: MailContext,
) {
	const sendIpc = makeIpcSender(mainWindow);

	mainWindow.on("maximize", () => sendIpc("windowMaximizedChanged", true));
	mainWindow.on("unmaximize", () => sendIpc("windowMaximizedChanged", false));

	handleIpcs({
		debug: handleDebug,
	});
	handleWindowIpcs();
	handleMailIpcs(sessionBus, mailContext);
}

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("org.chipichapa.postkassi");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	const sessionBus = createSessionBus();
	const mailContext = createMailContext(sessionBus);

	const { mainWindow, loadWindow } = await createWindow();

	setupMessaging(mainWindow, sessionBus, mailContext);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) loadWindow();
	});

	app.on("will-quit", () => {
		closeMailContext(mailContext);
		sessionBus.disconnect();
	});

	loadWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
