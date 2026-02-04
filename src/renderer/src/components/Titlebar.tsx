import { Flex } from "@renderer/styled-system/jsx";
import { useMemo } from "react";
import { Button } from "./Button";

export const Titlebar = () => {
	const titlebarLayout = useMemo(() => window.app.titlebarLayout, []);

	return (
		<Flex width="100%" justify="space-between">
			{titlebarLayout.left.map((item) => (
				<Button key={`left-${item}`}>{item}</Button>
			))}
			<div />
			{titlebarLayout.right.map((item) => (
				<Button key={`right-${item}`}>{item}</Button>
			))}
		</Flex>
	);
};
