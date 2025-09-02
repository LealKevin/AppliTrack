import type { PropsWithChildren } from "react";

function ApplicationIcons({ children }: PropsWithChildren) {
	return (
		<div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--border)]">
			<div className="flex gap-2">
				{children}
			</div>
		</div>
	);
}

export default ApplicationIcons;
