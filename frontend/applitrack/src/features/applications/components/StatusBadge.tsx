import { Badge } from "@/shared/components/ui/badge";

type StatusBadgeProps = {
	status: "pending" | "sent" | "rejected";
};

function StatusBadge({ status }: StatusBadgeProps) {
	const statusConfig = {
		pending: {
			label: "Pending",
			className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
		},
		sent: {
			label: "Sent",
			className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
		},
		rejected: {
			label: "Rejected",
			className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
		},
	};

	const config = statusConfig[status];

	return (
		<Badge 
			variant="outline" 
			className={`${config.className} text-xs font-medium px-2 py-1 rounded-full border-none`}
		>
			{config.label}
		</Badge>
	);
}

export default StatusBadge;