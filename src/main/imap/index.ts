import type {
	MailAddress,
	MailFolder,
	MailMessage,
	MailMessageBody,
} from "@shared/mail";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import {
	type GoaMailSettings,
	getGoaMailSettings,
	getGoaOAuth2Token,
} from "../goa/mail";
import type { MailContext } from "./context";

const IDLE_TIMEOUT_MS = 5 * 60 * 1000;

async function createClient(
	settings: GoaMailSettings,
	accessToken: string,
): Promise<ImapFlow> {
	const client = new ImapFlow({
		host: settings.imapHost,
		port: settings.imapPort,
		secure: settings.imapUseSsl,
		auth: {
			user: settings.imapUsername || settings.email,
			accessToken,
		},
		logger: false,
	});

	await client.connect();
	return client;
}

async function getConnection(
	mailContext: MailContext,
	accountPath: string,
): Promise<ImapFlow> {
	const currentTime = Date.now();
	const cached = mailContext.connections.get(accountPath);

	if (
		cached?.client.usable &&
		currentTime - cached.lastUsed < IDLE_TIMEOUT_MS
	) {
		cached.lastUsed = currentTime;
		return cached.client;
	}

	if (cached) {
		try {
			cached.client.close();
		} catch {}
		mailContext.connections.delete(accountPath);
	}

	const settings = await getGoaMailSettings(mailContext.bus, accountPath);
	const accessToken = await getGoaOAuth2Token(mailContext.bus, accountPath);
	if (!accessToken) {
		throw new Error(`Failed to get OAuth2 token for ${settings.email}`);
	}

	const client = await createClient(settings, accessToken);

	client.on("close", () => {
		mailContext.connections.delete(accountPath);
	});

	mailContext.connections.set(accountPath, {
		client,
		lastUsed: currentTime,
	});
	return client;
}

const toMailAddresses = (
	addressList: Array<{ name?: string; address?: string }> | undefined,
): MailAddress[] =>
	addressList?.map((addressEntry) => ({
		name: addressEntry.name ?? "",
		address: addressEntry.address ?? "",
	})) ?? [];

export async function fetchFolders(
	mailContext: MailContext,
	accountPath: string,
): Promise<MailFolder[]> {
	const client = await getConnection(mailContext, accountPath);
	const mailboxes = await client.list();

	return mailboxes.map((mailbox) => ({
		path: mailbox.path,
		name: mailbox.name,
		delimiter: mailbox.delimiter,
		flags: [...mailbox.flags],
		specialUse: mailbox.specialUse,
	}));
}

export async function fetchMessages(
	mailContext: MailContext,
	accountPath: string,
	folderPath: string,
	limit = 50,
): Promise<MailMessage[]> {
	const client = await getConnection(mailContext, accountPath);
	const mailboxLock = await client.getMailboxLock(folderPath);

	try {
		const mailboxStatus = client.mailbox;
		if (!mailboxStatus || mailboxStatus.exists === 0) return [];

		const totalMessages = mailboxStatus.exists;
		const startSequence = Math.max(1, totalMessages - limit + 1);
		const sequenceRange = `${startSequence}:*`;

		const messages: MailMessage[] = [];

		const iterator = client.fetch(sequenceRange, {
			uid: true,
			flags: true,
			envelope: true,
		});

		for await (const fetchedMessage of iterator) {
			messages.push({
				uid: fetchedMessage.uid,
				flags: [...(fetchedMessage.flags ?? [])],
				envelope: {
					date: fetchedMessage.envelope?.date?.toISOString() ?? "",
					subject: fetchedMessage.envelope?.subject ?? "",
					from: toMailAddresses(fetchedMessage.envelope?.from),
					to: toMailAddresses(fetchedMessage.envelope?.to),
					cc: toMailAddresses(fetchedMessage.envelope?.cc),
					messageId: fetchedMessage.envelope?.messageId ?? "",
					inReplyTo: fetchedMessage.envelope?.inReplyTo ?? "",
				},
			});
		}

		messages.reverse();
		return messages;
	} finally {
		mailboxLock.release();
	}
}

export async function fetchMessageBody(
	mailContext: MailContext,
	accountPath: string,
	folderPath: string,
	uid: number,
): Promise<MailMessageBody> {
	const client = await getConnection(mailContext, accountPath);
	const mailboxLock = await client.getMailboxLock(folderPath);

	try {
		const downloadResult = await client.download(String(uid), undefined, {
			uid: true,
		});

		const messageContent = downloadResult.content;
		if (!messageContent) {
			return { html: null, text: null };
		}

		const parsed = await simpleParser(messageContent);

		return {
			html: parsed.html || null,
			text: parsed.text || null,
		};
	} finally {
		mailboxLock.release();
	}
}
