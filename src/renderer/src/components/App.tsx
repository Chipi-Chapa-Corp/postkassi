import { useTheme } from "@renderer/hooks/theme";
import { useIpcMutation } from "@renderer/utility/query";
import type { FC } from "react";
import { Button } from "./Button";
import { Titlebar } from "./Titlebar";

export const App: FC = () => {
	const { execute, data, isPending } = useIpcMutation("debug");
	const theme = useTheme();

	return (
		<div className={theme.className}>
			<Titlebar />
			<p>{isPending ? "Loading..." : data}</p>
			<Button type="button" onClick={() => execute("ping")}>
				Debug
			</Button>
		</div>
	);
};
