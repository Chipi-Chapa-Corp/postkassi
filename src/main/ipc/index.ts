import type { IpcProtocol } from "@shared/ipc";
import type { MaybePromise } from "@shared/types";
import { type BrowserWindow, type IpcMainInvokeEvent, ipcMain } from "electron";

export type SendIpcFn = ReturnType<typeof makeIpcSender>;

export function makeIpcSender(window: BrowserWindow) {
	return <T extends keyof IpcProtocol>(
		channel: T,
		...args: Parameters<IpcProtocol[T]>
	) => window.webContents.send(channel, ...args);
}

export function handleIpc<T extends keyof IpcProtocol>(
	channel: T,
	callback: (
		event: IpcMainInvokeEvent,
		...args: Parameters<IpcProtocol[T]>
	) => Promise<Awaited<ReturnType<IpcProtocol[T]>>>,
): void {
	ipcMain.handle(channel, callback);
}

export function handleIpcs(
	map: Partial<
		Record<
			keyof IpcProtocol,
			(
				...args: Parameters<IpcProtocol[keyof IpcProtocol]>
			) => MaybePromise<Awaited<ReturnType<IpcProtocol[keyof IpcProtocol]>>>
		>
	>,
) {
	for (const [channel, callback] of Object.entries(map)) {
		handleIpc(channel as keyof IpcProtocol, (_event, ...args) =>
			Promise.resolve(callback(...args)),
		);
	}
}
