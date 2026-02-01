import { join } from "node:path";
import { is } from "@electron-toolkit/utils";
import { buildArgument } from "@shared/arguments";
import { BrowserWindow, shell } from "electron";
import icon from "../../resources/icon.png?asset";
import { getTitlebarLayout } from "./titlebar";

export async function createWindow() {
	const titlebarLayout = await getTitlebarLayout();

	const mainWindow = new BrowserWindow({
		width: 900,
		height: 670,
		show: false,
		autoHideMenuBar: true,
		frame: false,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.mjs"),
			sandbox: false,
			additionalArguments: [buildArgument("titlebarLayout", titlebarLayout)],
		},
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow.maximize();
		mainWindow.show();
	});

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	return () => {
		// HMR for renderer base on electron-vite cli.
		// Load the remote URL for development or the local html file for production.
		if (is.dev && process.env.ELECTRON_RENDERER_URL) {
			mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
		} else {
			mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
		}
	};
}
