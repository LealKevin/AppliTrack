type ApplicationCompanyProps = {
	company: string;
};

function ApplicationCompany({ company }: ApplicationCompanyProps) {
	return <p>{company}</p>;
}

export default ApplicationCompany;
