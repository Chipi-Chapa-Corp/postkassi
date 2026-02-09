import { styled } from "@renderer/styled-system/jsx";
import { useIpcQuery } from "@renderer/utility/query";
import type { FC } from "react";
import { Panel } from "react-resizable-panels";
import { Accounts } from "./Accounts";

const Wrapper = styled(Panel, {
	base: {
		bgColor: "panelBackground",
		padding: "sm",
		height: "100%",
		minWidth: "360px",
		userSelect: "none",
	},
});

export const Sidebar: FC = () => {
	const { data: accounts } = useIpcQuery("mailGetAccounts");

	return (
		<Wrapper minSize={360} defaultSize={360}>
			<Accounts accounts={accounts ?? []} />
		</Wrapper>
	);
};
