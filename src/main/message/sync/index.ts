import type { MailFolder } from "@shared/mail";
import type { Kysely } from "kysely";
import type { Database } from "../../database";
import type { InboxFolderSyncEntry } from "../../folder/sync";
import { fetchMessages } from "../../imap";
import type { MailContext } from "../../imap/context";
import {
	findExistingMessageBodyIds,
	syncMessageBody,
} from "./body";
import {
	createPersistedMessageSyncEntries,
} from "./entries";
import { syncMessageFlags } from "./flags";
import { upsertMessage } from "./message";
import { syncMessageRecipients } from "./recipients";
import { syncUsersForMessages } from "./users";

export async function syncFolderMessages(
	database: Kysely<Database>,
	mailContext: MailContext,
	accountPath: string,
	folder: MailFolder,
	folderId: number,
): Promise<void> {
	const messages = await fetchMessages(mailContext, accountPath, folder.path);
	const messageEntries = createPersistedMessageSyncEntries(
		messages,
		accountPath,
		folder.path,
	);
	const userIdByAddress = await syncUsersForMessages(database, messageEntries);
	const existingMessageBodyIds = await findExistingMessageBodyIds(
		database,
		messageEntries,
	);
	for (const messageEntry of messageEntries) {
		const senderLookupAddress = messageEntry.senderAddress || "unknown@local";
		const senderUserId = userIdByAddress.get(senderLookupAddress);
		if (senderUserId === undefined) {
			throw new Error(`Missing user for address: ${senderLookupAddress}`);
		}
		await upsertMessage(database, messageEntry, folderId, senderUserId);
		await syncMessageRecipients(
			database,
			messageEntry.persistedMessageId,
			messageEntry.message.envelope.to,
			"messageToUser",
			userIdByAddress,
		);
		await syncMessageRecipients(
			database,
			messageEntry.persistedMessageId,
			messageEntry.message.envelope.cc,
			"messageCcUser",
			userIdByAddress,
		);
		await syncMessageFlags(
			database,
			messageEntry.persistedMessageId,
			messageEntry.message.flags,
		);
		await syncMessageBody(
			database,
			mailContext,
			accountPath,
			folder.path,
			messageEntry,
			existingMessageBodyIds,
		);
	}
}

export async function syncMessages(
	database: Kysely<Database>,
	mailContext: MailContext,
	inboxFolders: InboxFolderSyncEntry[],
): Promise<void> {
	for (const inboxFolder of inboxFolders) {
		await syncFolderMessages(
			database,
			mailContext,
			inboxFolder.accountPath,
			inboxFolder.folder,
			inboxFolder.folderId,
		);
	}
}
