import type { PropsWithChildren } from "react";
import { Button } from "./ui/button";

type StatusButtonProps = {
	isActive: boolean;
	onClick: () => void;
};

function StatusButton({
	children,
	isActive,
	onClick,
}: PropsWithChildren<StatusButtonProps>) {
	return (
		<Button
			variant={isActive ? "default" : "secondary"}
			onClick={onClick}
			className="flex-1"
		>
			{children}
		</Button>
	);
}

export default StatusButton;
