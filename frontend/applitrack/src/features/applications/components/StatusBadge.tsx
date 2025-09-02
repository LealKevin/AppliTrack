import { Badge } from "@/shared/components/ui/badge";

type StatusBadgeProps = {
  status: "pending" | "sent" | "interview_scheduled" | "interviewing" | "rejected" | "offer";
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
    },
    sent: {
      label: "Sent",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    },
    interview_scheduled: {
      label: "Interview Scheduled",
      className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    },
    interviewing: {
      label: "Interviewing",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    },
    offer: {
      label: "Offer Received",
      className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={`${config.className} w-full text-xs font-medium px-2 py-1 rounded-full border-none`}
    >
      {config.label}
    </Badge>
  );
}

export default StatusBadge;
