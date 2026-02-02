export function buildArgument<_J extends true | false = true>(
	key: string,
	data: unknown,
	{ json = true }: { json?: boolean } = {},
) {
	return `--${key}=${json ? JSON.stringify(data) : data}`;
}

export function findArgument<
	T = unknown,
	_Json extends boolean = T extends string ? boolean : true,
>(
	key: string,
	argv: string[],
	{ json = true as _Json }: { json?: _Json } = {},
): _Json extends true ? T | null : string | null {
	const prefix = `--${key}=`;
	const argument = argv.find((argument) => argument.startsWith(prefix));
	try {
		return argument
			? json
				? JSON.parse(argument.slice(prefix.length))
				: (argument.slice(prefix.length) as _Json extends true ? T : string)
			: null;
	} catch {
		return null;
	}
}
