import type dbus from "dbus-next";
import type { Kysely } from "kysely";
import type { Database } from "../database";
import { getGoaAccounts } from "../goa/accounts";
import { upsertUser } from "../user";

export async function syncAccounts(
	database: Kysely<Database>,
	sessionBus: dbus.MessageBus,
) {
	const accounts = await getGoaAccounts(sessionBus);
	for (const account of accounts) {
		await upsertUser(database, account.email, account.name || undefined);
	}
	return accounts;
}
