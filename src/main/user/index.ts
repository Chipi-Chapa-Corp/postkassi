import type { Generated, Kysely } from "kysely";
import type { Database } from "../database";

export type UserTable = {
	id: Generated<number>;
	name: string | null;
	address: string;
};

const USER_UPSERT_CHUNK_SIZE = 400;

export type UserUpsertEntry = {
	address: string;
	name: string | null;
};

export async function upsertUser(
	database: Kysely<Database>,
	address: string,
	name: string | null,
): Promise<number> {
	const result = await database
		.insertInto("user")
		.values({
			address,
			name,
		})
		.onConflict((onConflictBuilder) =>
			onConflictBuilder.column("address").doUpdateSet({
				name,
			}),
		)
		.returning("id")
		.executeTakeFirstOrThrow();

	return result.id;
}

export async function upsertUsers(
	database: Kysely<Database>,
	userEntries: UserUpsertEntry[],
): Promise<Map<string, number>> {
	if (userEntries.length === 0) {
		return new Map<string, number>();
	}

	const userIdByAddress = new Map<string, number>();

	for (
		let startIndex = 0;
		startIndex < userEntries.length;
		startIndex += USER_UPSERT_CHUNK_SIZE
	) {
		const chunkEntries = userEntries.slice(
			startIndex,
			startIndex + USER_UPSERT_CHUNK_SIZE,
		);

		const chunkResult = await database
			.insertInto("user")
			.values(chunkEntries)
			.onConflict((builder) =>
				builder.column("address").doUpdateSet({
					name: (expression) => expression.ref("excluded.name"),
				}),
			)
			.returning(["id", "address"])
			.execute();

		for (const userRow of chunkResult) {
			userIdByAddress.set(userRow.address, userRow.id);
		}
	}

	return userIdByAddress;
}
