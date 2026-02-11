import type { MailMessage } from "@shared/mail";
import type { Kysely } from "kysely";
import type { Database } from "../../database";

export async function syncMessageRecipients(
	database: Kysely<Database>,
	messageId: string,
	addresses: MailMessage["envelope"]["to"] | MailMessage["envelope"]["cc"],
	tableName: "messageToUser" | "messageCcUser",
	userIdByAddress: Map<string, number>,
): Promise<void> {
	const recipientUserIds: number[] = [];
	for (const addressEntry of addresses) {
		if (!addressEntry.address) {
			continue;
		}
		const recipientUserId = userIdByAddress.get(addressEntry.address);
		if (recipientUserId === undefined) {
			throw new Error(`Missing user for address: ${addressEntry.address}`);
		}
		recipientUserIds.push(recipientUserId);
	}
	await database
		.deleteFrom(tableName)
		.where("messageId", "=", messageId)
		.execute();
	if (recipientUserIds.length === 0) {
		return;
	}
	if (tableName === "messageToUser") {
		await database
			.insertInto("messageToUser")
			.values(
				recipientUserIds.map((recipientUserId) => ({
					messageId,
					userId: recipientUserId,
				})),
			)
			.onConflict((onConflictBuilder) => onConflictBuilder.doNothing())
			.execute();
		return;
	}
	await database
		.insertInto("messageCcUser")
		.values(
			recipientUserIds.map((recipientUserId) => ({
				messageId,
				userId: recipientUserId,
			})),
		)
		.onConflict((onConflictBuilder) => onConflictBuilder.doNothing())
		.execute();
}
