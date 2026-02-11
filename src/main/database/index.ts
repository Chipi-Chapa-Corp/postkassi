import SQLite from "better-sqlite3";
import {
	Kysely,
	type Migration,
	type MigrationProvider,
	Migrator,
	SqliteDialect,
} from "kysely";
import type { FolderTable } from "../folder";
import type {
	MessageBodyTable,
	MessageCcUserTable,
	MessageFlagsTable,
	MessageTable,
	MessageToUserTable,
} from "../message";
import type { UserTable } from "../user";
export type Database = {
	user: UserTable;
	folder: FolderTable;
	message: MessageTable;
	messageBody: MessageBodyTable;
	messageToUser: MessageToUserTable;
	messageCcUser: MessageCcUserTable;
	messageFlags: MessageFlagsTable;
};

const migrationModules = import.meta.glob<{
	up: Migration["up"];
	down: Migration["down"];
}>("./migrations/*.ts", { eager: true });

const migrationProvider: MigrationProvider = {
	getMigrations: async () =>
		Object.fromEntries(
			Object.entries(migrationModules).map(([modulePath, migrationModule]) => {
				const migrationFileName = modulePath.split("/").at(-1);
				if (!migrationFileName) {
					throw new Error(`Invalid migration module path: ${modulePath}`);
				}
				const migrationName = migrationFileName.slice(
					0,
					migrationFileName.length - ".ts".length,
				);
				return [
					migrationName,
					{
						up: migrationModule.up,
						down: migrationModule.down,
					},
				] as const;
			}),
		),
};

export async function connectToDatabase() {
	const dialect = new SqliteDialect({
		database: new SQLite("postkassi.db"),
	});

	const database = new Kysely<Database>({
		dialect,
	});

	await migrateDatabase(database);
	return database;
}

async function migrateDatabase(database: Kysely<Database>): Promise<void> {
	const migrator = new Migrator({
		db: database,
		provider: migrationProvider,
	});

	const migrationResult = await migrator.migrateToLatest();
	if (migrationResult.error) {
		throw migrationResult.error;
	}
}
