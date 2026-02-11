import type { MailMessage } from "@shared/mail";

export type PersistedMessageSyncEntry = {
	message: MailMessage;
	persistedMessageId: string;
	senderAddress: string;
	senderName: string | undefined;
	messageDate: Date;
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
		const senderName = senderAddressEntry?.name || undefined;
		const messageDate = message.envelope.date
			? new Date(message.envelope.date)
			: new Date();
		return {
			message,
			persistedMessageId,
			senderAddress,
			senderName,
			messageDate,
		};
	});
}
