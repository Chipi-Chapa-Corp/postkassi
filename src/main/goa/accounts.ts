import type { MailAccount } from "@shared/mail";
import type dbus from "dbus-next";
import { unwrap } from "./utility";

type ManagedInterfaces = Record<string, Record<string, unknown>>;
type ManagedObjects = Record<string, ManagedInterfaces>;

export async function getGoaAccounts(
	bus: dbus.MessageBus,
): Promise<MailAccount[]> {
	const proxyObject = await bus.getProxyObject(
		"org.gnome.OnlineAccounts",
		"/org/gnome/OnlineAccounts",
	);
	const objectManager = proxyObject.getInterface(
		"org.freedesktop.DBus.ObjectManager",
	);
	const managedObjects: ManagedObjects =
		await objectManager.GetManagedObjects();

	const accounts = Object.entries(managedObjects).flatMap(
		([objectPath, interfaces]) => {
			const accountInterface = interfaces["org.gnome.OnlineAccounts.Account"];
			const mailInterface = interfaces["org.gnome.OnlineAccounts.Mail"];
			if (!accountInterface || !mailInterface) return [];

			const emailAddress = unwrap(mailInterface.EmailAddress) ?? "";
			const accountName =
				unwrap(accountInterface.PresentationIdentity) ||
				emailAddress ||
				"Unknown";
			const providerName = unwrap(accountInterface.ProviderName) ?? "Unknown";
			const hasOAuth2Support =
				"org.gnome.OnlineAccounts.OAuth2Based" in interfaces;

			return [
				{
					path: objectPath,
					name: accountName,
					provider: providerName,
					email: emailAddress,
					hasOAuth2: hasOAuth2Support,
				},
			];
		},
	);

	return accounts;
}
