import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserContext } from "@/hooks/useUser";

const iconHome = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-6"
	>
		<path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
		<path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
	</svg>
);

const iconUser = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-6"
	>
		<path
			fillRule="evenodd"
			d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
			clipRule="evenodd"
		/>
	</svg>
);

const iconAlert = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		className="size-6"
	>
		<path
			fillRule="evenodd"
			d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
			clipRule="evenodd"
		/>
	</svg>
);

function Header() {
	const { pathname } = useLocation();
	return (
		<header className="sticky">
			<nav className="flex justify-center ">
				<Button className="self-start flex-start w-10 h-10 m-4" asChild>
					<Link to="/">{iconHome}</Link>
				</Button>

				<Button
					variant={pathname === "/offers" ? "default" : "secondary"}
					className="w-48 m-4 flex-auto h-10"
					asChild
				>
					<Link to="/offers">Offers</Link>
				</Button>
				<Button
					variant={pathname === "/applications" ? "default" : "secondary"}
					className="w-48 m-4 flex-auto h-10"
					asChild
				>
					<Link to="/applications">Applications</Link>
				</Button>
				<Button
					variant={pathname === "/stats" ? "default" : "secondary"}
					className="w-48 m-4 flex-auto h-10"
					asChild
				>
					<Link to="/stats">Stats</Link>
				</Button>
				<Button className="self-end  m-4 w-10 h-10" asChild>
					<Link to="/stats">{iconAlert}</Link>
				</Button>

				<Button className="self-end  m-4 w-10 h-10" asChild>
					<Link to="/stats">{iconUser}</Link>
				</Button>
			</nav>
		</header>
	);
}

export default Header;
