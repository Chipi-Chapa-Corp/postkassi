import { execFile } from "node:child_process";

export async function getGsetting<T extends "string" | "boolean" | "number">(
	type: T,
	schema: string,
	key: string,
) {
	return new Promise<T>((resolve, reject) => {
		execFile("gsettings", ["get", schema, key], (error, stdout, _stderr) => {
			if (error) {
				reject(error);
			}
			const value = stdout.trim().slice(1, -1);
			resolve(
				{
					string: () => value,
					boolean: () => value === "true",
					number: () => Number(value),
				}[type]() as T,
			);
		});
	});
}
