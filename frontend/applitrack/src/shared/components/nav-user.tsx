import { IconDotsVertical, IconLogout, IconSettings } from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shared/components/ui/sidebar";
import type { UserType } from "@/shared/utils/apiCalls";
import { useAuth } from "@/features/authentication/contexts/AuthContext";
import { UserProfileSheet } from "@/shared/components/UserProfileSheet";

type NavUserProps = {
	user: UserType | null;
};

export function NavUser({ user }: NavUserProps) {
	const { isMobile } = useSidebar();
	const { logout } = useAuth();

	console.log("User nav bar", user);

	return (
		<SidebarMenu className="group-data-[collapsible=icon]:-mt-2">
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{/* Expanded state - full avatar */}
							<Avatar className="h-8 w-8 rounded-lg grayscale group-data-[collapsible=icon]:hidden">
								<AvatarFallback className="rounded-lg">
									{user?.name?.charAt(0)?.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							
							{/* Collapsed state - simple letter circle */}
							<div className="hidden group-data-[collapsible=icon]:flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-sm font-normal text-foreground grayscale">
								{user?.name?.charAt(0)?.toUpperCase()}
							</div>
							
							<div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
								<span className="truncate font-medium">{user?.name}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user?.email}
								</span>
							</div>
							<IconDotsVertical className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarFallback className="rounded-lg">
										{/*user.Name.charAt(0)*/}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user?.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user?.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<UserProfileSheet user={user}>
							<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
								<IconSettings />
								Profile Settings
							</DropdownMenuItem>
						</UserProfileSheet>
						<DropdownMenuItem
							onClick={() => {
								logout();
							}}
						>
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
