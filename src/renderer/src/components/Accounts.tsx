import { Flex } from "@renderer/styled-system/jsx";
import type { MailAccount } from "@shared/mail";
import type { FC } from "react";
import { Account } from "./Account";

type AccountsProps = {
	accounts: MailAccount[];
};

export const Accounts: FC<AccountsProps> = ({ accounts }) => (
	<Flex direction="column" gap="sm">
		{accounts.map((account) => (
			<Account key={account.path} account={account} />
		))}
	</Flex>
);
