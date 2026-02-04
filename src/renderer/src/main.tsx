import "@renderer/index.css";
import "@renderer/styled-system/styles.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import { ThemeProvider } from "./hooks/theme";
import { QueryProvider } from "./utility/query";

const root = document.getElementById("root");

if (!root) {
	throw new Error("Root element not found");
}

createRoot(root).render(
	<StrictMode>
		<QueryProvider>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</QueryProvider>
	</StrictMode>,
);
