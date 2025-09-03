import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Calendar, Building2, ExternalLink } from "lucide-react";
import type { ReminderWithApplication } from "@/shared/types/api";
import type { ReminderUrgency } from "../types/dashboard";
import { useNavigate } from "react-router-dom";

interface ReminderCardProps {
  reminder: ReminderWithApplication;
  urgency: ReminderUrgency;
  compact?: boolean;
}

function ReminderCard({ reminder, urgency, compact = false }: ReminderCardProps) {
  const navigate = useNavigate();
  const app = reminder.Application;

  // Guard clause for missing application data
  if (!app) {
    return (
      <div className={`border rounded-lg bg-gray-50 border-l-4 border-l-gray-400 ${compact ? 'py-2 px-3' : 'py-3 px-4'}`}>
        <div className="text-sm text-muted-foreground">
          Application data not available for this reminder
        </div>
      </div>
    );
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays === 1) return "1 day overdue";
      if (absDays < 7) return `${absDays} days overdue`;
      if (absDays < 30) return `${Math.floor(absDays / 7)} weeks overdue`;
      return `${Math.floor(absDays / 30)} months overdue`;
    }
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays < 7) return `Due in ${diffDays} days`;
    if (diffDays < 30) return `Due in ${Math.floor(diffDays / 7)} weeks`;
    return `Due in ${Math.floor(diffDays / 30)} months`;
  };

  const getBorderColor = () => {
    switch (urgency.color) {
      case 'red': return 'border-l-red-400';
      case 'orange': return 'border-l-orange-400';
      case 'blue': return 'border-l-blue-400';
      default: return 'border-l-gray-400';
    }
  };

  const handleViewApplication = () => {
    if (app?.id) {
      navigate(`/applications?highlight=${app.id}`);
    }
  };

  return (
    <div className={`border rounded-lg bg-white hover:bg-gray-50 transition-colors border-l-4 ${getBorderColor()} ${compact ? 'py-2 px-3' : 'py-3 px-4'}`}>
      <div className="flex items-center justify-between gap-4">
        {/* Left section - Priority and basic info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-base">{urgency.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {app.title_application || 'Untitled Application'}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{app.company || 'Unknown Company'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatRelativeDate(reminder.reminder_date)}</span>
            </div>
            <Badge 
              variant={(app.status === 'rejected') ? 'destructive' : 
                      (app.status === 'pending') ? 'secondary' : 
                      (app.status === 'sent') ? 'outline' : 'default'}
              className="text-xs"
            >
              {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
            </Badge>
          </div>
        </div>
        
        {/* Right section - Action button */}
        <div className="flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewApplication}
            className={`${compact ? 'h-7 text-xs' : 'h-8 text-sm'}`}
          >
            <ExternalLink className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-1`} />
            View
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReminderCard;