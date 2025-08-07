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
			className="flex-1 rounded-[15px] border-none transition-all duration-300 hover:translate-y-[-1px]"
			style={{
				background: 'var(--app-card-bg)',
				boxShadow: isActive 
					? 'var(--app-status-active-shadow)' 
					: 'var(--app-status-inactive-shadow)',
				color: 'var(--foreground)'
			}}
		>
			{children}
		</Button>
	);
}

export default StatusButton;
