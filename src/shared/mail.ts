export type MailAddress = {
	name: string;
	address: string;
};

export type MailAccount = {
	path: string;
	name: string;
	provider: string;
	email: string;
	hasOAuth2: boolean;
};

export type MailFolder = {
	path: string;
	name: string;
	delimiter: string;
	flags: string[];
	specialUse?: string;
};

export type MailEnvelope = {
	date: string;
	subject: string;
	from: MailAddress[];
	to: MailAddress[];
	cc: MailAddress[];
	messageId: string;
	inReplyTo: string;
};

export type MailMessage = {
	uid: number;
	flags: string[];
	envelope: MailEnvelope;
};

export type MailMessageBody = {
	html: string | null;
	text: string | null;
};
