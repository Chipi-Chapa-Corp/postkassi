export function buildArgument<_J extends true | false = true>(
	key: string,
	data: unknown,
	{ json = true }: { json?: boolean } = {},
) {
	return `--${key}=${json ? JSON.stringify(data) : data}`;
}

export function findArgument<
	T = unknown,
	J extends true | false = T extends string ? false : true,
>(
	key: string,
	argv: string[],
	{ json = true as J }: { json?: J } = {},
): J extends true ? T | null : string | null {
	const prefix = `--${key}=`;
	const argument = argv.find((argument) => argument.startsWith(prefix));
	return argument
		? json
			? JSON.parse(argument.slice(prefix.length))
			: (argument.slice(prefix.length) as J extends true ? T : string)
		: null;
}
