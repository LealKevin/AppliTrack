type ApplicationCompanyProps = {
	company: string;
};

function ApplicationCompany({ company }: ApplicationCompanyProps) {
	return (
		<div className="flex items-center gap-2">
			<div className="w-6 h-6 rounded-full bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
				<span className="text-xs font-medium text-[var(--muted-foreground)]">
					{company.charAt(0).toUpperCase()}
				</span>
			</div>
			<p className="text-xs font-medium text-[var(--muted-foreground)] truncate">
				{company}
			</p>
		</div>
	);
}

export default ApplicationCompany;
