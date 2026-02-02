import type { IpcProtocol } from "@shared/ipc";

export function invokeIpc<T extends keyof IpcProtocol>(
	channel: T,
	...args: Parameters<IpcProtocol[T]>
): Promise<Awaited<ReturnType<IpcProtocol[T]>>> {
	return window.electron.ipcRenderer.invoke(channel, ...args);
}

export function handleIpc<T extends keyof IpcProtocol>(
	channel: T,
	callback: (
		...args: Parameters<IpcProtocol[T]>
	) => Awaited<ReturnType<IpcProtocol[T]>>,
) {
	return window.electron.ipcRenderer.on(channel, (_event, ...args) =>
		callback(...(args as Parameters<IpcProtocol[T]>)),
	);
}
