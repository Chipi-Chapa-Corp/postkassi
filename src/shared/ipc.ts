export type IpcProtocol = {
	debug(payload: string): string;
	themeUpdated(theme: "light" | "dark"): void;
	windowMinimize(): void;
	windowMaximize(): void;
	windowUnmaximize(): void;
	windowClose(): void;
	windowIsMaximized(): boolean;
	windowMaximizedChanged(isMaximized: boolean): void;
};
