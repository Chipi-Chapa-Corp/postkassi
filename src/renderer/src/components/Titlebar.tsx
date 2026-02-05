import { Flex } from "@renderer/styled-system/jsx";
import { Maximize, Minimize, Minus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WindowControl } from "./WindowControl";

export const Titlebar = () => {
	const titlebarLayout = useMemo(() => window.app.controls.titlebarLayout, []);

	const [isMaximized, setIsMaximized] = useState(false);

	useEffect(() => {
		let isActive = true;

		window.app.controls.getIsMaximized().then((value) => {
			if (isActive) setIsMaximized(value);
		});

		const unsubscribe = window.app.controls.onIsMaximizedChange((value) => {
			if (isActive) setIsMaximized(value);
		});

		return () => {
			isActive = false;
			unsubscribe();
		};
	}, []);

	const handleMinimize = useCallback(() => {
		window.app.controls.minimize();
	}, []);

	const handleToggleMaximize = useCallback(() => {
		if (isMaximized) {
			window.app.controls.unmaximize();
		} else {
			window.app.controls.maximize();
		}
	}, [isMaximized]);

	const handleClose = useCallback(() => {
		window.app.controls.close();
	}, []);

	const renderables = useMemo(
		() => ({
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
		}),
		[handleClose, handleMinimize, handleToggleMaximize, isMaximized],
	);

	return (
		<Flex width="100%" justify="center" gap="sm">
			{titlebarLayout.left.map((item) => renderables[item])}
			<div />
			{titlebarLayout.right.map((item) => renderables[item])}
		</Flex>
	);
};
