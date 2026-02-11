import type { Kysely } from "kysely";
import type { Database } from "../../database";
import type { PersistedMessageSyncEntry } from "./entries";

export async function upsertMessage(
	database: Kysely<Database>,
	messageEntry: PersistedMessageSyncEntry,
	folderId: number,
	senderUserId: number,
): Promise<void> {
	await database
		.insertInto("message")
		.values({
			messageId: messageEntry.persistedMessageId,
			date: messageEntry.messageDate,
			folderId,
			fromUserId: senderUserId,
		})
		.onConflict((builder) =>
			builder.column("messageId").doUpdateSet({
				date: messageEntry.messageDate,
				folderId,
				fromUserId: senderUserId,
			}),
		)
		.execute();
}
