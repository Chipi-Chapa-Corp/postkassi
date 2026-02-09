import { Flex } from "@renderer/styled-system/jsx";
import type { MailAccount } from "@shared/mail";
import type { FC } from "react";

type AccountProps = {
	account: MailAccount;
};

export const Account: FC<AccountProps> = ({ account }) => (
	<Flex
		padding="sm"
		bgColor="itemBackground"
		rounded="sm"
		_hover={{ bgColor: "itemHoverBackground" }}
	>
		<p>{account.name}</p>
	</Flex>
);
