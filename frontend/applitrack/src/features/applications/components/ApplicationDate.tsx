type ApplicationDataProps = {
	date: string;
};

function ApplicationDate({ date }: ApplicationDataProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric'
		});
	};

	return (
		<div className="flex items-center gap-1">
			<svg className="w-3 h-3 text-[var(--muted-foreground)] opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
			<span className="text-xs text-[var(--muted-foreground)] opacity-75">
				{formatDate(date)}
			</span>
		</div>
	);
}

export default ApplicationDate;
