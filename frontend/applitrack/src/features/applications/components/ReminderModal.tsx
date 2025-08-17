import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/shared/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { format } from "date-fns";
import type { IApplication } from "@/shared/types/api";
import useReminders from "../hooks/useReminders";
import useToast from "@/shared/hooks/useToast";

type ReminderModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  application: IApplication;
  existingReminderId?: string;
  existingReminderDate?: string;
};

function ReminderModal({
  handleClose,
  isModalOpen,
  application,
  existingReminderId,
  existingReminderDate,
}: ReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    existingReminderDate ? new Date(existingReminderDate) : undefined
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { createReminderForApplication, updateReminder, deleteReminder, createReminder } = useReminders();
  const toast = useToast();

  // Smart date suggestions based on application status and age
  const getSmartSuggestions = () => {
    const now = new Date();
    const suggestions = [];

    // Always add basic options
    suggestions.push({
      label: "1 week",
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    });
    
    suggestions.push({
      label: "2 weeks", 
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
    });
    
    suggestions.push({
      label: "1 month",
      date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    });

    // Smart suggestions based on application status
    if (application.status === "rejected") {
      suggestions.push({
        label: "6 months (recommended for re-apply)",
        date: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000)
      });
    } else if (application.status === "pending" || application.status === "sent") {
      suggestions.push({
        label: "3 weeks (recommended for follow-up)",
        date: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000)
      });
    }

    return suggestions;
  };

  const smartSuggestions = getSmartSuggestions();

  const handleSave = () => {
    if (!selectedDate) {
      toast.error("Please select a reminder date");
      return;
    }

    const isoDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    if (existingReminderId) {
      // Update existing reminder
      updateReminder.mutate({
        id: existingReminderId,
        data: {
          reminder_date: isoDate,
          status: 'pending'
        }
      }, {
        onSuccess: () => {
          toast.success("Reminder updated successfully");
          handleClose();
        },
        onError: (error) => {
          toast.error("Failed to update reminder");
          console.error("Update reminder error:", error);
        }
      });
    } else {
      // Create new reminder
      createReminderForApplication(application.id, isoDate);
      
      // Handle success/error through the hook's mutation callbacks
      if (createReminder.isSuccess) {
        toast.success("Reminder set successfully");
        handleClose();
      } else if (createReminder.isError) {
        toast.error("Failed to set reminder");
      }
    }
  };

  const handleDelete = () => {
    if (!existingReminderId) return;

    deleteReminder.mutate(existingReminderId, {
      onSuccess: () => {
        toast.success("Reminder deleted");
        handleClose();
      },
      onError: (error) => {
        toast.error("Failed to delete reminder");
        console.error("Delete reminder error:", error);
      }
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingReminderId ? "Edit Reminder" : "Set Reminder"}
          </DialogTitle>
          <div className="text-sm text-muted-foreground mt-2">
            <strong>{application.title_application}</strong> at <strong>{application.company}</strong>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Smart Suggestions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Quick Options</label>
            <div className="grid grid-cols-2 gap-2">
              {smartSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(suggestion.date)}
                  className={cn(
                    "justify-start h-auto py-2 px-3",
                    selectedDate && selectedDate.toDateString() === suggestion.date.toDateString() &&
                    "bg-primary text-primary-foreground"
                  )}
                >
                  <div className="text-left">
                    <div className="font-medium text-xs">{suggestion.label}</div>
                    <div className="text-xs opacity-70">
                      {format(suggestion.date, "MMM d, yyyy")}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Date Picker */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Or choose custom date</label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setIsCalendarOpen(false);
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {existingReminderId && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteReminder.isPending}
            >
              {deleteReminder.isPending ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!selectedDate || updateReminder.isPending}
          >
            {existingReminderId ? "Update" : "Set Reminder"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ReminderModal;