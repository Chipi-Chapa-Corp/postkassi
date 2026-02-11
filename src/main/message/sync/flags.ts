import type { Kysely } from "kysely";
import type { Database } from "../../database";

export async function syncMessageFlags(
	database: Kysely<Database>,
	messageId: string,
	flags: string[],
): Promise<void> {
	await database
		.deleteFrom("messageFlags")
		.where("messageId", "=", messageId)
		.execute();
	if (flags.length === 0) {
		return;
	}
	await database
		.insertInto("messageFlags")
		.values(flags.map((flag) => ({ messageId, flag })))
		.onConflict((builder) => builder.doNothing())
		.execute();
}
