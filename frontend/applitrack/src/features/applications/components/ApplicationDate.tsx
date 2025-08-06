type ApplicationDataProps = {
	date: string;
};

function ApplicationDate({ date }: ApplicationDataProps) {
	return <div className=" ml-auto">{date}</div>;
}

export default ApplicationDate;
