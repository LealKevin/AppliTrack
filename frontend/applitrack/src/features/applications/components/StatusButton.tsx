import type { PropsWithChildren } from "react";
import { Button } from "@/shared/components/ui/button";

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
			onClick={onClick}
			variant={isActive ? "default" : "outline"}
			className="flex-1"
		>
			{children}
		</Button>
	);
}

export default StatusButton;
