import type { ElectronAPI } from "@electron-toolkit/preload";
import type { AppAPI } from "./api";

declare global {
	interface Window {
		electron: ElectronAPI;
		app: AppAPI;
	}
}
