import { Button } from "@/shared/components/ui/button";

const iconBell = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-3"
	>
		<path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.219 8.219 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.719 9.719 0 0 0 19.267 2.5Z" />
		<path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
	</svg>
);

const iconBellActive = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-3 text-blue-500"
	>
		<path d="M5.85 3.5a.75.75 0 0 0-1.117-1 9.719 9.719 0 0 0-2.348 4.876.75.75 0 0 0 1.479.248A8.219 8.219 0 0 1 5.85 3.5ZM19.267 2.5a.75.75 0 1 0-1.118 1 8.219 8.219 0 0 1 1.987 4.124.75.75 0 0 0 1.48-.248A9.719 9.719 0 0 0 19.267 2.5Z" />
		<path fillRule="evenodd" d="M12 2.25A6.75 6.75 0 0 0 5.25 9v.75a8.217 8.217 0 0 1-2.119 5.52.75.75 0 0 0 .298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 1 0 7.48 0 24.583 24.583 0 0 0 4.83-1.244.75.75 0 0 0 .298-1.205 8.217 8.217 0 0 1-2.118-5.52V9A6.75 6.75 0 0 0 12 2.25ZM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 0 0 4.496 0l.002.1a2.25 2.25 0 1 1-4.5 0Z" clipRule="evenodd" />
	</svg>
);

type ReminderButtonProps = {
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	hasActiveReminder?: boolean;
};

function ReminderButton({ onClick, hasActiveReminder = false }: ReminderButtonProps) {
	console.log('🔔 ReminderButton render:', { hasActiveReminder });
	return (
		<Button 
			onClick={onClick} 
			className="w-6 h-6 rounded-[8px] border-none transition-all duration-200 hover:scale-105 opacity-60 hover:opacity-100"
			style={{
				background: 'var(--app-card-bg)',
				boxShadow: 'var(--app-button-shadow)',
				color: hasActiveReminder ? 'rgb(59 130 246)' : 'var(--foreground)'
			}}
			title={hasActiveReminder ? "Edit Reminder" : "Set Reminder"}
		>
			{hasActiveReminder ? iconBellActive : iconBell}
		</Button>
	);
}

export default ReminderButton;