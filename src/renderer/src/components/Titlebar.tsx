import { useMemo } from "react";

export const Titlebar = () => {
	const titlebarLayout = useMemo(() => {
		return window.titlebarLayout;
	}, []);

	return (
		<div style={{ display: "flex", justifyContent: "space-between" }}>
			{titlebarLayout.left.map((item) => (
				<button type="button" key={`left-${item}`}>
					{item}
				</button>
			))}
			<div style={{ flex: 1 }} />
			{titlebarLayout.right.map((item) => (
				<button type="button" key={`right-${item}`}>
					{item}
				</button>
			))}
		</div>
	);
};
