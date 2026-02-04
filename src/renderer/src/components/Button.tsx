import { styled } from "@renderer/styled-system/jsx";

export const Button = styled("button", {
	base: {
		padding: "sm",
		color: "text",
		border: "none",
		borderRadius: "sm",
		backgroundColor: "itemBackground",
		_hover: {
			backgroundColor: "itemHoverBackground",
		},
	},
});
