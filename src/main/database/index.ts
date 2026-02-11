import * as fs from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import SQLite from "better-sqlite3";
import { FileMigrationProvider, Kysely, Migrator, SqliteDialect } from "kysely";
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
	const migrationFolder = path.join(
		path.dirname(fileURLToPath(import.meta.url)),
		"migrations",
	);

	const provider = new FileMigrationProvider({
		fs,
		path,
		migrationFolder,
	});

	const migrator = new Migrator({
		db: database,
		provider,
	});

	const migrationResult = await migrator.migrateToLatest();
	if (migrationResult.error) {
		throw migrationResult.error;
	}
}
