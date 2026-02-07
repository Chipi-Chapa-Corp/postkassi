import { darkMediaQuery } from "@renderer/utility/media";
import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";

type ThemeName = "dark" | "light";

export const ThemeContext = createContext<ThemeName>("dark");

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	const [theme, setTheme] = useState<ThemeName>(() => {
		const preferred = darkMediaQuery().matches ? "dark" : "light";
		document.documentElement.dataset.theme = preferred;
		return preferred;
	});

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	useEffect(() => {
		const mediaQuery = darkMediaQuery();
		const onChange = (event: MediaQueryListEvent) =>
			setTheme(event.matches ? "dark" : "light");

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, []);

	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
