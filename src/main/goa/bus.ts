import dbus from "dbus-next";

export function createSessionBus(): dbus.MessageBus {
	return dbus.sessionBus();
}
