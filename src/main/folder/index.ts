import type { MailFolder } from "@shared/mail";
import type { Generated, Kysely } from "kysely";
import type { Database } from "../database";

export type FolderTable = {
	id: Generated<number>;
	path: string;
	name: string;
};

export function isInboxFolder(folder: MailFolder): boolean {
	const normalizedFolderName = folder.name.trim().toLowerCase();
	const normalizedSpecialUse = folder.specialUse?.toLowerCase();
	const normalizedPath = folder.path.trim().toLowerCase();
	return (
		normalizedFolderName === "inbox" ||
		normalizedPath === "inbox" ||
		normalizedSpecialUse === "\\inbox"
	);
}

export function getPersistedFolderPath(
	accountPath: string,
	folderPath: string,
): string {
	return `${accountPath}:${folderPath}`;
}

export async function upsertFolder(
	database: Kysely<Database>,
	accountPath: string,
	folder: MailFolder,
): Promise<number> {
	const persistedFolderPath = getPersistedFolderPath(accountPath, folder.path);
	const existingFolder = await database
		.selectFrom("folder")
		.select("id")
		.where("path", "=", persistedFolderPath)
		.executeTakeFirst();

	if (existingFolder) {
		return existingFolder.id;
	}

	await database
		.insertInto("folder")
		.values({
			path: persistedFolderPath,
			name: folder.name,
		})
		.execute();

	const createdFolder = await database
		.selectFrom("folder")
		.select("id")
		.where("path", "=", persistedFolderPath)
		.executeTakeFirstOrThrow();

	return createdFolder.id;
}
