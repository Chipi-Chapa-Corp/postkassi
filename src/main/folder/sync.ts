import type { MailAccount, MailFolder } from "@shared/mail";
import type { Kysely } from "kysely";
import type { Database } from "../database";
import { fetchFolders } from "../imap";
import type { MailContext } from "../imap/context";
import { isInboxFolder, upsertFolder } from ".";

export type InboxFolderSyncEntry = {
	accountPath: string;
	folder: MailFolder;
	folderId: number;
};

export async function syncFolders(
	database: Kysely<Database>,
	mailContext: MailContext,
	accounts: MailAccount[],
): Promise<InboxFolderSyncEntry[]> {
	const inboxFolders: InboxFolderSyncEntry[] = [];
	for (const account of accounts) {
		const folders = await fetchFolders(mailContext, account.path);
		for (const folder of folders) {
			const folderId = await upsertFolder(database, account.path, folder);
			if (!isInboxFolder(folder)) {
				continue;
			}
			inboxFolders.push({
				accountPath: account.path,
				folder,
				folderId,
			});
		}
	}
	return inboxFolders;
}
