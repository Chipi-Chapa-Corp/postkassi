import { findArgument } from "@shared/arguments";
import type { TitlebarLayout } from "../../main/titlebar";

export const makeTitlebarLayoutApi = () =>
	findArgument<TitlebarLayout>("titlebarLayout", process.argv) ?? {
		left: ["appmenu"],
		right: ["minimize", "maximize", "close"],
	};
