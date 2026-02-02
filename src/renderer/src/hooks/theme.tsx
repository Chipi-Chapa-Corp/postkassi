import { lightTheme } from "@renderer/styles/light";
import { darkTheme } from "@renderer/utility/styled";
import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export const ThemeContext = createContext<typeof darkTheme | typeof lightTheme>(
	darkTheme,
);

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	const mediaQuery = useMemo(
		() => window.matchMedia("(prefers-color-scheme: dark)"),
		[],
	);
	const [theme, setTheme] = useState<typeof darkTheme | typeof lightTheme>(
		mediaQuery.matches ? darkTheme : lightTheme,
	);

	useEffect(() => {
		const onChange = (event: MediaQueryListEvent) =>
			setTheme(event.matches ? darkTheme : lightTheme);

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, [mediaQuery]);

	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
