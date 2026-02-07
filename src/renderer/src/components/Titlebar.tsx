import { useIsMaximized } from "@renderer/hooks/window";
import { Flex } from "@renderer/styled-system/jsx";
import { draggable, nonDraggable } from "@renderer/utility/style";
import { Maximize, Minimize, Minus, X } from "lucide-react";
import { WindowControl } from "./WindowControl";

export const Titlebar = () => {
	const titlebarLayout = window.app.controls.titlebarLayout;

	const isMaximized = useIsMaximized();

	const handleMinimize = () => window.app.controls.minimize();

	const handleToggleMaximize = () => {
		if (isMaximized) {
			window.app.controls.unmaximize();
		} else {
			window.app.controls.maximize();
		}
	};

	const handleClose = () => window.app.controls.close();

	const renderables = {
		close: (
			<WindowControl key="close" onClick={handleClose}>
				<X size={18} />
			</WindowControl>
		),
		maximize: (
			<WindowControl key="maximize" onClick={handleToggleMaximize}>
				{isMaximized ? <Minimize size={18} /> : <Maximize size={18} />}
			</WindowControl>
		),
		minimize: (
			<WindowControl key="minimize" onClick={handleMinimize}>
				<Minus size={18} />
			</WindowControl>
		),
	};

	return (
		<Flex
			width="100%"
			justify="space-between"
			gap="sm"
			padding="xs"
			backgroundColor="panelBackground"
			style={draggable}
		>
			<Flex gap="sm" style={nonDraggable}>
				{titlebarLayout.left.map((item) => renderables[item])}
			</Flex>
			<div />
			<Flex gap="sm" style={nonDraggable}>
				{titlebarLayout.right.map((item) => renderables[item])}
			</Flex>
		</Flex>
	);
};
