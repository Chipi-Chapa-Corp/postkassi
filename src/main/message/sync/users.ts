import type { Kysely } from "kysely";
import type { Database } from "../../database";
import { upsertUsers } from "../../user";
import type { PersistedMessageSyncEntry } from "./entries";

export async function syncUsersForMessages(
	database: Kysely<Database>,
	messageEntries: PersistedMessageSyncEntry[],
): Promise<Map<string, number>> {
	const nameByAddress = new Map<string, string | null>();
	for (const messageEntry of messageEntries) {
		if (messageEntry.senderAddress) {
			nameByAddress.set(
				messageEntry.senderAddress,
				messageEntry.senderName ?? null,
			);
		} else {
			nameByAddress.set("unknown@local", "Unknown");
		}
		for (const recipientAddressEntry of messageEntry.message.envelope.to) {
			if (!recipientAddressEntry.address) {
				continue;
			}
			nameByAddress.set(
				recipientAddressEntry.address,
				recipientAddressEntry.name || null,
			);
		}
		for (const recipientAddressEntry of messageEntry.message.envelope.cc) {
			if (!recipientAddressEntry.address) {
				continue;
			}
			nameByAddress.set(
				recipientAddressEntry.address,
				recipientAddressEntry.name || null,
			);
		}
	}
	const userEntries = Array.from(nameByAddress, ([address, name]) => ({
		address,
		name,
	}));
	return upsertUsers(database, userEntries);
}
