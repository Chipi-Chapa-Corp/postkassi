import { Flex } from "@renderer/styled-system/jsx";
import type { FC } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { Sidebar } from "./Sidebar";

export const Content: FC = () => {
	return (
		<Flex
			direction="column"
			width="100%"
			height="100%"
			justify="start"
			align="start"
		>
			<Group>
				<Sidebar />
				<Separator />
				<Panel>
					<p>Content</p>
				</Panel>
			</Group>
		</Flex>
	);
};
