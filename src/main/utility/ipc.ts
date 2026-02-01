import type { IpcProtocol } from "@shared/ipc";
import { type IpcMainInvokeEvent, ipcMain } from "electron";

export function handleIpc<T extends keyof IpcProtocol>(
	channel: T,
	callback: (
		event: IpcMainInvokeEvent,
		...args: Parameters<IpcProtocol[T]>
	) => Promise<Awaited<ReturnType<IpcProtocol[T]>>>,
): void {
	ipcMain.handle(channel, callback);
}
