import { useIpcMutation } from "@renderer/utility/query";
import type { FC } from "react";

export const App: FC = () => {
	const { execute, data, isPending } = useIpcMutation("debug");

	return (
		<div>
			<p>{isPending ? "Loading..." : data}</p>
			<button type="button" onClick={() => execute("ping")}>
				Debug
			</button>
		</div>
	);
};
