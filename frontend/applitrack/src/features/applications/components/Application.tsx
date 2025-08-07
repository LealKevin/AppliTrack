import type { PropsWithChildren } from "react";
import { Card } from "@/shared/components/ui/card";

function Application({ children }: PropsWithChildren) {
	return (
		<Card
			className="relative group p-5 rounded-[20px] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg overflow-hidden border-0"
			style={{
				background: 'var(--app-card-bg)',
				boxShadow: 'var(--app-card-shadow)'
			}}
		>
			<div className="h-full min-h-[140px]">
				{children}
			</div>
		</Card>
	);
}

export default Application;
