export type IpcProtocol = {
	debug(payload: string): string;
	themeUpdated(theme: "light" | "dark"): void;
};
