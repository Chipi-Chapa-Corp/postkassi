import { useIsMaximized } from "@renderer/hooks/window";
import { Flex } from "@renderer/styled-system/jsx";
import type { FC } from "react";
import { Content } from "./Content";
import { Titlebar } from "./Titlebar";

export const App: FC = () => {
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
			<Content />
		</Flex>
	);
};
