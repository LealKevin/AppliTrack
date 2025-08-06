import type { PropsWithChildren } from "react";
function ApplicationIcons({ children }: PropsWithChildren) {
	return <div className=" flex justify-end">{children}</div>;
}

export default ApplicationIcons;
