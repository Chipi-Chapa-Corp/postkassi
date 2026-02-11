import type { MailMessage } from "@shared/mail";

export type PersistedMessageSyncEntry = {
	message: MailMessage;
	persistedMessageId: string;
	senderAddress: string;
	senderName: string | null;
	messageDate: number;
};

export function createPersistedMessageSyncEntries(
	messages: MailMessage[],
	accountPath: string,
	folderPath: string,
): PersistedMessageSyncEntry[] {
	return messages.map((message) => {
		const persistedMessageId =
			message.envelope.messageId ||
			`${accountPath}:${folderPath}:${String(message.uid)}`;
		const senderAddressEntry = message.envelope.from[0];
		const senderAddress = senderAddressEntry?.address || "";
		const senderName = senderAddressEntry?.name || null;
		const parsedMessageDate = message.envelope.date
			? Date.parse(message.envelope.date)
			: Number.NaN;
		const messageDate = Number.isNaN(parsedMessageDate)
			? Date.now()
			: parsedMessageDate;
		return {
			message,
			persistedMessageId,
			senderAddress,
			senderName,
			messageDate,
		};
	});
}
