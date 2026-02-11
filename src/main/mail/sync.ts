import type dbus from "dbus-next";
import type { Kysely } from "kysely";
import { syncAccounts } from "../accounts/sync";
import type { Database } from "../database";
import { syncFolders } from "../folder/sync";
import type { MailContext } from "../imap/context";
import { syncMessages } from "../message/sync";

export async function syncMail(
	database: Kysely<Database>,
	sessionBus: dbus.MessageBus,
	mailContext: MailContext,
): Promise<void> {
	const accounts = await syncAccounts(database, sessionBus);
	const inboxFolders = await syncFolders(database, mailContext, accounts);
	await syncMessages(database, mailContext, inboxFolders);
}
