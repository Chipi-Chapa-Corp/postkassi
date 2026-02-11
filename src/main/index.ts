import { electronApp, optimizer } from "@electron-toolkit/utils";
import type dbus from "dbus-next";
import { app, BrowserWindow } from "electron";
import type { Kysely } from "kysely";
import { connectToDatabase, type Database } from "./database";
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
import { syncMail } from "./mail/sync";
import { createWindow } from "./window";

function setupMessaging(
	database: Kysely<Database>,
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
	handleMailIpcs(database, sessionBus, mailContext);
}

app.whenReady().then(async () => {
	electronApp.setAppUserModelId("org.chipichapa.postkassi");

	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	const sessionBus = createSessionBus();
	const mailContext = createMailContext(sessionBus);
	const database = await connectToDatabase();

	const { mainWindow, loadWindow } = await createWindow();

	setupMessaging(database, mainWindow, sessionBus, mailContext);

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) loadWindow();
	});

	app.on("will-quit", () => {
		closeMailContext(mailContext);
		sessionBus.disconnect();
		void database.destroy();
	});

	loadWindow();

	await syncMail(database, sessionBus, mailContext);
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
