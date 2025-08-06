type ApplicationTitleProps = {
	title: string;
};

function ApplicationTitle({ title }: ApplicationTitleProps) {
	return <h2 className="text-lg font-semibold">{title}</h2>;
}

export default ApplicationTitle;
