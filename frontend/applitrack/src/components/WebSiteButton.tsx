import { Button } from "./ui/button";

type WebSiteButtonProps = {
	url: string;
};

function WebSiteButton({ url }: WebSiteButtonProps) {
	let color = "currentcolor";
	if (url === null) {
		color = "lightGrey";
	}

	const iconWebsite = (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill={color}
			className="size-4"
		>
			<path
				fillRule="evenodd"
				d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
				clipRule="evenodd"
			/>
		</svg>
	);

	return (
		<Button
			onClick={url !== null ? () => window.open(url, "_blank") : undefined}
			variant="outline"
			className="m-2 w-8 h-8"
		>
			{iconWebsite}
		</Button>
	);
}

export default WebSiteButton;
