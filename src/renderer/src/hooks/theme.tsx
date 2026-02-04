import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

type ThemeName = "dark" | "light";

export const ThemeContext = createContext<ThemeName>("dark");

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
	const mediaQuery = useMemo(
		() => window.matchMedia("(prefers-color-scheme: dark)"),
		[],
	);
	const [theme, setTheme] = useState<ThemeName>(() => {
		const preferred = mediaQuery.matches ? "dark" : "light";
		document.documentElement.dataset.theme = preferred;
		return preferred;
	});

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	useEffect(() => {
		const onChange = (event: MediaQueryListEvent) =>
			setTheme(event.matches ? "dark" : "light");

		mediaQuery.addEventListener("change", onChange);
		return () => mediaQuery.removeEventListener("change", onChange);
	}, [mediaQuery]);

	return (
		<ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
