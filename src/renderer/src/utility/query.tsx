import type { IpcProtocol } from "@shared/ipc";
import {
	QueryClient,
	QueryClientProvider,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import type { FC, PropsWithChildren } from "react";
import { invokeIpc } from "./ipc";

const client = new QueryClient();

export const QueryProvider: FC<PropsWithChildren> = ({ children }) => (
	<QueryClientProvider client={client}>{children}</QueryClientProvider>
);

export const useIpcQuery = <T extends keyof IpcProtocol>(
	channel: T,
	...args: Parameters<IpcProtocol[T]>
) =>
	useQuery({
		queryKey: [channel, ...args],
		queryFn: () => invokeIpc(channel, ...args),
	});

export function useIpcMutation<T extends keyof IpcProtocol>(channel: T) {
	const mutation = useMutation({
		mutationFn: (args: Parameters<IpcProtocol[T]>) =>
			invokeIpc(channel, ...(args as Parameters<IpcProtocol[T]>)),
	});

	return {
		...mutation,
		execute: (...args: Parameters<IpcProtocol[T]>) => mutation.mutate(args),
		executeAsync: (...args: Parameters<IpcProtocol[T]>) =>
			mutation.mutateAsync(args),
	};
}
