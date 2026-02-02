import { makeTitlebarLayoutApi } from "./titlebar";

export async function createAppApi() {
	return {
		titlebarLayout: makeTitlebarLayoutApi(),
	};
}

export type AppAPI = Awaited<ReturnType<typeof createAppApi>>;
