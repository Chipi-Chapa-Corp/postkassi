import type { Kysely } from "kysely";
import type { Database } from "../index";

export async function up(db: Kysely<Database>): Promise<void> {
	await db.schema
		.createTable("user")
		.addColumn("id", "integer", (c) => c.primaryKey().autoIncrement())
		.addColumn("name", "text")
		.addColumn("address", "text", (c) => c.notNull().unique())
		.execute();

	await db.schema
		.createTable("folder")
		.addColumn("id", "integer", (c) => c.primaryKey().autoIncrement())
		.addColumn("path", "text", (c) => c.notNull())
		.addColumn("name", "text", (c) => c.notNull())
		.execute();

	await db.schema
		.createTable("message")
		.addColumn("messageId", "text", (c) => c.primaryKey())
		.addColumn("date", "datetime", (c) => c.notNull())
		.addColumn("folderId", "integer", (c) => c.notNull())
		.addColumn("fromUserId", "integer", (c) => c.notNull())
		.addForeignKeyConstraint(
			"message_folder_fk",
			["folderId"],
			"folder",
			["id"],
			(cb) => cb.onDelete("restrict").onUpdate("cascade"),
		)
		.addForeignKeyConstraint(
			"message_from_fk",
			["fromUserId"],
			"user",
			["id"],
			(cb) => cb.onDelete("restrict").onUpdate("cascade"),
		)
		.execute();

	await db.schema
		.createTable("messageBody")
		.addColumn("messageId", "text", (c) => c.primaryKey())
		.addColumn("html", "text")
		.addColumn("text", "text")
		.addForeignKeyConstraint(
			"messageBody_message_fk",
			["messageId"],
			"message",
			["messageId"],
			(cb) => cb.onDelete("cascade").onUpdate("cascade"),
		)
		.execute();

	await db.schema
		.createTable("messageToUser")
		.addColumn("messageId", "text", (c) => c.notNull())
		.addColumn("userId", "integer", (c) => c.notNull())
		.addPrimaryKeyConstraint("messageToUser_pk", ["messageId", "userId"])
		.addForeignKeyConstraint(
			"mtu_message_fk",
			["messageId"],
			"message",
			["messageId"],
			(cb) => cb.onDelete("cascade").onUpdate("cascade"),
		)
		.addForeignKeyConstraint("mtu_user_fk", ["userId"], "user", ["id"], (cb) =>
			cb.onDelete("restrict").onUpdate("cascade"),
		)
		.execute();

	await db.schema
		.createTable("messageCcUser")
		.addColumn("messageId", "text", (c) => c.notNull())
		.addColumn("userId", "integer", (c) => c.notNull())
		.addPrimaryKeyConstraint("messageCcUser_pk", ["messageId", "userId"])
		.addForeignKeyConstraint(
			"mcu_message_fk",
			["messageId"],
			"message",
			["messageId"],
			(cb) => cb.onDelete("cascade").onUpdate("cascade"),
		)
		.addForeignKeyConstraint("mcu_user_fk", ["userId"], "user", ["id"], (cb) =>
			cb.onDelete("restrict").onUpdate("cascade"),
		)
		.execute();

	await db.schema
		.createTable("messageFlags")
		.addColumn("messageId", "text", (c) => c.notNull())
		.addColumn("flag", "text", (c) => c.notNull())
		.addPrimaryKeyConstraint("messageFlags_pk", ["messageId", "flag"])
		.addForeignKeyConstraint(
			"messageFlags_message_fk",
			["messageId"],
			"message",
			["messageId"],
			(cb) => cb.onDelete("cascade").onUpdate("cascade"),
		)
		.execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
	await db.schema.dropTable("messageFlags").execute();
	await db.schema.dropTable("messageCcUser").execute();
	await db.schema.dropTable("messageToUser").execute();
	await db.schema.dropTable("messageBody").execute();
	await db.schema.dropTable("message").execute();
	await db.schema.dropTable("folder").execute();
	await db.schema.dropTable("user").execute();
}
