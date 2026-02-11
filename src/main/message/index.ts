export type MessageToUserTable = {
	messageId: string;
	userId: number;
};

export type MessageCcUserTable = {
	messageId: string;
	userId: number;
};

export type MessageFlagsTable = {
	messageId: string;
	flag: string;
};

export type MessageTable = {
	messageId: string;
	date: number;
	folderId: number;
	fromUserId: number;
};

export type MessageBodyTable = {
	messageId: string;
	html: string | null;
	text: string | null;
};
