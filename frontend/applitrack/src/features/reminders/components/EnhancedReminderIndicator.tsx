import { Circle } from "lucide-react";
import type { Reminder } from "@/shared/types/api";

interface EnhancedReminderIndicatorProps {
  reminder: Reminder | null;
  onClick?: () => void;
}

function EnhancedReminderIndicator({ reminder, onClick }: EnhancedReminderIndicatorProps) {
  const getReminderState = () => {
    if (!reminder) {
      return {
        icon: <Circle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />,
        title: "Click to set reminder"
      };
    }

    const today = new Date().toISOString().split('T')[0];
    const reminderDate = reminder.reminder_date;
    
    if (reminder.status === 'completed') {
      return {
        icon: <Circle className="h-4 w-4 text-red-500 fill-red-500 hover:text-red-600 cursor-pointer transition-colors" />,
        title: "Completed reminder"
      };
    }

    if (reminderDate < today) {
      // Overdue - pulsing red
      return {
        icon: <Circle className="h-4 w-4 text-red-500 fill-red-500 hover:text-red-600 cursor-pointer transition-colors animate-pulse" />,
        title: `Overdue reminder - was due ${new Date(reminderDate).toLocaleDateString()}`
      };
    }

    if (reminderDate === today) {
      // Due today - solid orange
      return {
        icon: <Circle className="h-4 w-4 text-orange-500 fill-orange-500 hover:text-orange-600 cursor-pointer transition-colors" />,
        title: `Reminder due today`
      };
    }

    // Future reminder - solid blue
    const dueDate = new Date(reminderDate).toLocaleDateString();
    return {
      icon: <Circle className="h-4 w-4 text-blue-500 fill-blue-500 hover:text-blue-600 cursor-pointer transition-colors" />,
      title: `Active reminder - due ${dueDate}`
    };
  };

  const { icon, title } = getReminderState();

  return (
    <div className="flex justify-center">
      <div 
        title={title}
        onClick={onClick}
        className="cursor-pointer"
      >
        {icon}
      </div>
    </div>
  );
}

export default EnhancedReminderIndicator;