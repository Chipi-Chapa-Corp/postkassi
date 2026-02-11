import type { Kysely } from "kysely";
import type { Database } from "../../database";
import { fetchMessageBody } from "../../imap";
import type { MailContext } from "../../imap/context";
import type { PersistedMessageSyncEntry } from "./entries";

export async function findExistingMessageBodyIds(
	database: Kysely<Database>,
	messageEntries: PersistedMessageSyncEntry[],
): Promise<Set<string>> {
	const messageIds = messageEntries.map((entry) => entry.persistedMessageId);
	if (messageIds.length === 0) {
		return new Set<string>();
	}
	const messageBodyRows = await database
		.selectFrom("messageBody")
		.select("messageId")
		.where("messageId", "in", messageIds)
		.execute();
	return new Set(messageBodyRows.map((row) => row.messageId));
}

export async function syncMessageBody(
	database: Kysely<Database>,
	mailContext: MailContext,
	accountPath: string,
	folderPath: string,
	messageEntry: PersistedMessageSyncEntry,
	existingMessageBodyIds: Set<string>,
): Promise<void> {
	if (existingMessageBodyIds.has(messageEntry.persistedMessageId)) {
		return;
	}
	const messageBody = await fetchMessageBody(
		mailContext,
		accountPath,
		folderPath,
		messageEntry.message.uid,
	);
	await database
		.insertInto("messageBody")
		.values({
			messageId: messageEntry.persistedMessageId,
			html: messageBody.html,
			text: messageBody.text,
		})
		.onConflict((builder) =>
			builder.column("messageId").doUpdateSet({
				html: messageBody.html,
				text: messageBody.text,
			}),
		)
		.execute();
	existingMessageBodyIds.add(messageEntry.persistedMessageId);
}
