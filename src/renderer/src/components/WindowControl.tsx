import { styled } from "@renderer/styled-system/jsx";
import { Button } from "./Button";

export const WindowControl = styled(Button, {
	base: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		rounded: "full",
		padding: "xs",
	},
});
