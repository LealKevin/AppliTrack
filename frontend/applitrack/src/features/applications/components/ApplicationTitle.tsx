type ApplicationTitleProps = {
	title: string;
};

function ApplicationTitle({ title }: ApplicationTitleProps) {
	return (
		<h3 className="font-semibold text-[var(--foreground)] line-clamp-2 leading-tight text-sm">
			{title}
		</h3>
	);
}

export default ApplicationTitle;
