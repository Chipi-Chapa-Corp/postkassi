import type dbus from "dbus-next";
import type { ImapFlow } from "imapflow";

type CachedConnection = {
	client: ImapFlow;
	lastUsed: number;
};

export type MailContext = {
	bus: dbus.MessageBus;
	connections: Map<string, CachedConnection>;
};

export function createMailContext(bus: dbus.MessageBus): MailContext {
	return { bus, connections: new Map() };
}

export function closeMailContext(mailContext: MailContext): void {
	for (const [, { client }] of mailContext.connections) {
		try {
			client.close();
		} catch {}
	}
	mailContext.connections.clear();
}
