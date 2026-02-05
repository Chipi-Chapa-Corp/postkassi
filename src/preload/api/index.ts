import { createControlsApi } from "./controls";

export async function createAppApi() {
	return {
		controls: await createControlsApi(),
	};
}

export type AppAPI = Awaited<ReturnType<typeof createAppApi>>;
