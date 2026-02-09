import { useIsMaximized } from "@renderer/hooks/window";
import { Flex } from "@renderer/styled-system/jsx";
import { useIpcMutation } from "@renderer/utility/query";
import type { FC } from "react";
import { Button } from "./Button";
import { Titlebar } from "./Titlebar";

export const App: FC = () => {
	const {
		execute: fetchAccounts,
		data: accounts,
		isPending: isFetchingAccounts,
	} = useIpcMutation("mailGetAccounts");
	const {
		execute: fetchFolders,
		data: folders,
		isPending: isFetchingFolders,
	} = useIpcMutation("mailGetFolders");
	const {
		execute: fetchMessages,
		data: messages,
		isPending: isFetchingMessages,
	} = useIpcMutation("mailGetMessages");
	const {
		execute: fetchMessageBody,
		data: messageBody,
		isPending: isFetchingMessageBody,
	} = useIpcMutation("mailGetMessageBody");

	const isMaximized = useIsMaximized();

	return (
		<Flex
			direction="column"
			width="100%"
			height="100%"
			justify="space-between"
			align="center"
			borderWidth={isMaximized ? "0" : "thin"}
			borderColor="panelBackground"
			borderStyle="solid"
		>
			<Titlebar />
			<p>
				{isFetchingAccounts ? "Loading..." : JSON.stringify(accounts, null, 2)}
				{isFetchingFolders ? "Loading..." : JSON.stringify(folders, null, 2)}
				{isFetchingMessages ? "Loading..." : JSON.stringify(messages, null, 2)}
				{isFetchingMessageBody
					? "Loading..."
					: JSON.stringify(messageBody, null, 2)}
			</p>
			<Button type="button" onClick={() => fetchAccounts()}>
				Load Accounts
			</Button>
			{!!accounts && (
				<Button type="button" onClick={() => fetchFolders(accounts[0].path)}>
					Load Folders
				</Button>
			)}
			{!!folders && !!accounts && (
				<Button
					type="button"
					onClick={() => fetchMessages(accounts[0].path, folders[0].path)}
				>
					Load Messages
				</Button>
			)}
			{!!messages && !!folders && !!accounts && (
				<Button
					type="button"
					onClick={() =>
						fetchMessageBody(accounts[0].path, folders[0].path, messages[0].uid)
					}
				>
					Load Message Body
				</Button>
			)}
		</Flex>
	);
};
