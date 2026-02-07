import { useEffect, useState } from "react";

export function useIsMaximized() {
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

	return isMaximized;
}
