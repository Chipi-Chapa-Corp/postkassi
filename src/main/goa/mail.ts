import type dbus from "dbus-next";
import { unwrap } from "./utility";

export type GoaMailSettings = {
	email: string;
	imapHost: string;
	imapPort: number;
	imapUsername: string;
	imapUseSsl: boolean;
	imapUseTls: boolean;
};

export async function getGoaMailSettings(
	bus: dbus.MessageBus,
	accountPath: string,
): Promise<GoaMailSettings> {
	const proxyObject = await bus.getProxyObject(
		"org.gnome.OnlineAccounts",
		accountPath,
	);
	const propertiesInterface = proxyObject.getInterface(
		"org.freedesktop.DBus.Properties",
	);
	const mailProperties = (await propertiesInterface.GetAll(
		"org.gnome.OnlineAccounts.Mail",
	)) as Record<string, unknown>;

	return {
		email: unwrap(mailProperties.EmailAddress) ?? "",
		imapHost: unwrap(mailProperties.ImapHost) || "imap.gmail.com",
		imapPort: Number(unwrap(mailProperties.ImapPort)) || 993,
		imapUsername: unwrap(mailProperties.ImapUserName) ?? "",
		imapUseSsl: Boolean(unwrap<boolean>(mailProperties.ImapUseSsl)),
		imapUseTls: Boolean(unwrap<boolean>(mailProperties.ImapUseTls)),
	};
}

export async function getGoaOAuth2Token(
	bus: dbus.MessageBus,
	accountPath: string,
): Promise<string | null> {
	const proxyObject = await bus.getProxyObject(
		"org.gnome.OnlineAccounts",
		accountPath,
	);
	const oauth2Interface = proxyObject.getInterface(
		"org.gnome.OnlineAccounts.OAuth2Based",
	);
	const accessTokenResult = await oauth2Interface.GetAccessToken();

	const accessToken = Array.isArray(accessTokenResult)
		? accessTokenResult[0]
		: accessTokenResult;
	return accessToken ? String(accessToken) : null;
}
