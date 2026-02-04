import { Flex } from "@renderer/styled-system/jsx";
import { useIpcMutation } from "@renderer/utility/query";
import type { FC } from "react";
import { Button } from "./Button";
import { Titlebar } from "./Titlebar";

export const App: FC = () => {
	const { execute, data, isPending } = useIpcMutation("debug");

	return (
		<Flex
			direction="column"
			width="100%"
			height="100%"
			justify="space-between"
			align="center"
		>
			<Titlebar />
			<p>{isPending ? "Loading..." : data}</p>
			<Button type="button" onClick={() => execute("ping")}>
				Debug
			</Button>
		</Flex>
	);
};
