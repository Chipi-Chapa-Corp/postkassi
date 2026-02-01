import type { IpcProtocol } from "@shared/ipc";
import type { IpcRendererEvent } from "electron/renderer";

export function invokeIpc<T extends keyof IpcProtocol>(
	channel: T,
	...args: Parameters<IpcProtocol[T]>
): Promise<Awaited<ReturnType<IpcProtocol[T]>>> {
	return window.electron.ipcRenderer.invoke(channel, ...args);
}

export function handleIpc<T extends keyof IpcProtocol>(
	channel: T,
	callback: (
		event: IpcRendererEvent,
		...args: Parameters<IpcProtocol[T]>
	) => Awaited<ReturnType<IpcProtocol[T]>>,
): void {
	window.electron.ipcRenderer.on(channel, callback);
}
