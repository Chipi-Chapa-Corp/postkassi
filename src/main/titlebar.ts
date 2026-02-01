import { getGsetting } from "./gsettings";

type TitlebarItem = "minimize" | "maximize" | "close" | "menu";

export type TitlebarLayout = {
	left: TitlebarItem[];
	right: TitlebarItem[];
};

export async function getTitlebarLayout(): Promise<TitlebarLayout> {
	const layout = await getGsetting(
		"string",
		"org.gnome.desktop.wm.preferences",
		"button-layout",
	);

	const [left, right] = layout.split(":");

	return {
		left: left.split(","),
		right: right.split(","),
	} as TitlebarLayout;
}
