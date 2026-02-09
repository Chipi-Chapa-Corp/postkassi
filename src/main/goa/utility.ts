import type { Variant } from "dbus-next";

export function unwrap<T = string>(value: unknown): T {
	if (value !== null && typeof value === "object" && "value" in value) {
		return (value as Variant).value as T;
	}
	return value as T;
}
