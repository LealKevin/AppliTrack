import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useUserConnectionModal } from "@/features/authentication/contexts/userConnectionModalProvider";
import useDisconnection from "@/features/authentication/hooks/useDisconnection";
import NotificationBell from "../../features/reminders/components/NotificationBell";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/components/ui/sheet";

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

function Header() {
	const { openModal: openConnectionModal } = useUserConnectionModal();
	const { pathname } = useLocation();
	const [isOpen, setIsOpen] = useState(false);

	const { mutate: disconnect } = useDisconnection();

	const navigationItems = [
		{ path: "/offers", label: "Offers" },
		{ path: "/applications", label: "Applications" },
		{ path: "/stats", label: "Stats" },
	];

	const handleDisconnect = () => {
		disconnect();
		setIsOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{/* Desktop Navigation */}
			<nav className="hidden md:flex items-center justify-between px-6 py-3">
				<div className="flex items-center space-x-2">
					<Button size="sm" variant="ghost" asChild>
						<Link to="/" className="flex items-center">
							{iconHome}
						</Link>
					</Button>
				</div>

				<div className="flex items-center space-x-2">
					{navigationItems.map((item) => (
						<Button
							key={item.path}
							variant={pathname === item.path ? "default" : "ghost"}
							size="sm"
							asChild
						>
							<Link to={item.path}>{item.label}</Link>
						</Button>
					))}
				</div>

				<div className="flex items-center space-x-2">
					<NotificationBell />
					<Button size="sm" variant="ghost" onClick={() => disconnect()}>
						Logout
					</Button>
					<Button size="sm" variant="ghost" onClick={openConnectionModal}>
						{iconUser}
					</Button>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<nav className="md:hidden flex items-center justify-between px-4 py-3">
				<Button size="sm" variant="ghost" asChild>
					<Link to="/" className="flex items-center">
						{iconHome}
					</Link>
				</Button>

				<div className="flex items-center space-x-2">
					<NotificationBell />
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild>
							<Button size="sm" variant="ghost">
								<Menu className="h-5 w-5" />
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-64">
							<div className="flex flex-col space-y-4 mt-8">
								{navigationItems.map((item) => (
									<Button
										key={item.path}
										variant={pathname === item.path ? "default" : "ghost"}
										size="lg"
										className="justify-start"
										asChild
										onClick={() => setIsOpen(false)}
									>
										<Link to={item.path}>{item.label}</Link>
									</Button>
								))}
								<hr className="my-4" />
								<Button
									variant="ghost"
									size="lg"
									className="justify-start"
									onClick={() => {
										openConnectionModal();
										setIsOpen(false);
									}}
								>
									Profile
								</Button>
								<Button
									variant="ghost"
									size="lg"
									className="justify-start text-destructive"
									onClick={handleDisconnect}
								>
									Logout
								</Button>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</nav>
		</header>
	);
}

export default Header;