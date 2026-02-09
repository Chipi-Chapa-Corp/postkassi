import type {
	MailAccount,
	MailFolder,
	MailMessage,
	MailMessageBody,
} from "./mail";

type GenericIpc = {
	debug(payload: string): string;
	themeUpdated(theme: "light" | "dark"): void;
};

type WindowIpc = {
	windowMinimize(): void;
	windowMaximize(): void;
	windowUnmaximize(): void;
	windowClose(): void;
	windowIsMaximized(): boolean;
	windowMaximizedChanged(isMaximized: boolean): void;
};

type MailIpc = {
	mailGetAccounts(): MailAccount[];
	mailGetFolders(accountPath: string): MailFolder[];
	mailGetMessages(accountPath: string, folderPath: string): MailMessage[];
	mailGetMessageBody(
		accountPath: string,
		folderPath: string,
		uid: number,
	): MailMessageBody;
};

export type IpcProtocol = GenericIpc & WindowIpc & MailIpc;
