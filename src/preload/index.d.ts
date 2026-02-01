import type { ElectronAPI } from "@electron-toolkit/preload";
import type { TitlebarLayout } from "../main/titlebar";

declare global {
	interface Window {
		electron: ElectronAPI;
		titlebarLayout: TitlebarLayout;
	}
}
