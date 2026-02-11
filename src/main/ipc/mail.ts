import type dbus from "dbus-next";
import type { Kysely } from "kysely";
import type { Database } from "../database";
import { getGoaAccounts } from "../goa/accounts";
import { fetchFolders, fetchMessageBody, fetchMessages } from "../imap";
import type { MailContext } from "../imap/context";
import { syncMail } from "../mail/sync";
import { handleIpc } from ".";

export function handleMailIpcs(
	database: Kysely<Database>,
	sessionBus: dbus.MessageBus,
	mailContext: MailContext,
): void {
	handleIpc("mailGetAccounts", async () => getGoaAccounts(sessionBus));

	handleIpc("mailGetFolders", async (_event, accountPath) =>
		fetchFolders(mailContext, accountPath),
	);

	handleIpc("mailGetMessages", async (_event, accountPath, folderPath) =>
		fetchMessages(mailContext, accountPath, folderPath),
	);

	handleIpc(
		"mailGetMessageBody",
		async (_event, accountPath, folderPath, uid) =>
			fetchMessageBody(mailContext, accountPath, folderPath, uid),
	);

	handleIpc("mailSync", async () =>
		syncMail(database, sessionBus, mailContext),
	);
}
