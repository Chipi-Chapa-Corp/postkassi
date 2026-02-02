import { styled } from "@renderer/utility/styled";

export const Button = styled("button", {
	padding: "$sm",
	color: "$text",
	border: "none",
	borderRadius: "$sm",
	backgroundColor: "$itemBackground",
	"&:hover": {
		backgroundColor: "$itemHoverBackground",
	},
});
