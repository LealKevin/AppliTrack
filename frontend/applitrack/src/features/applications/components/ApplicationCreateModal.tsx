import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import type { IApplication, ApplicationStatus } from "@/shared/types/api";
import useCreateApplication from "../hooks/useCreateApplication";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/shared/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { format } from "date-fns";
import { createApplicationSchema, parseApplicationFormData, useFormValidation } from "@/shared/validation";

type CreateModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
  onSuccess: () => void;
};

function ApplicationCreateModal({
  handleClose,
  isModalOpen,
  onSuccess,
}: CreateModalProps) {
  const [status, setStatus] = useState<ApplicationStatus>("pending");
  const [date, setDate] = useState<Date>();
  const sentDateFormatted = date
    ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()
    : new Date().toISOString();

  const createApp = useCreateApplication();
  const { validate, getFieldError, clearErrors } = useFormValidation(createApplicationSchema);

  const handleCreateApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();
    
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    // Parse FormData and prepare for validation
    const applicationData = parseApplicationFormData(formData);
    applicationData.sent_date = sentDateFormatted;
    applicationData.status = status;
    
    const validation = validate(applicationData);
    
    if (!validation.success) {
      return; // Validation errors will be displayed via getFieldError
    }

    const newApplication: IApplication = {
      title_application: validation.data!.title,
      company: validation.data!.company,
      location: validation.data!.location,
      url_application: validation.data!.url_application || "",
      sent_date: validation.data!.sent_date,
      status: validation.data!.status,
      notes: validation.data!.notes || "",
      id: "",
      created_at: "",
      updated_at: "",
    };
    
    await createApp.mutateAsync(newApplication);
    onSuccess();
    handleClose();
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Create Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateApplication}>
          <div className="grid gap-2 py-4">
            <div>
              <Input 
                name="TitleApplication" 
                placeholder="Title" 
                className={getFieldError("title") ? "border-red-500" : ""}
              />
              {getFieldError("title") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("title")}</span>
              )}
            </div>
            <div>
              <Input 
                name="Company" 
                placeholder="Company" 
                className={getFieldError("company") ? "border-red-500" : ""}
              />
              {getFieldError("company") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("company")}</span>
              )}
            </div>
            <div>
              <Input 
                name="Location" 
                placeholder="Location" 
                className={getFieldError("location") ? "border-red-500" : ""}
              />
              {getFieldError("location") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("location")}</span>
              )}
            </div>
            <div>
              <Input 
                name="UrlApplication" 
                placeholder="Application url" 
                className={getFieldError("url_application") ? "border-red-500" : ""}
              />
              {getFieldError("url_application") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("url_application")}</span>
              )}
            </div>
            <div>
              <Popover
                onOpenChange={(open) => {
                  console.log('🔄 CreateModal Popover state change:', { open, date });
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "rounded-xl",
                      "input justify-start text-left font-normal",
                      !date && "text-muted-foreground",
                      getFieldError("sent_date") && "border-red-500"
                    )}
                    onClick={() => {
                      console.log('📅 CreateModal Date picker clicked', { currentDate: date });
                    }}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="bg-muted w-auto p-0 rounded-sm"
                  onOpenAutoFocus={() => {
                    console.log('🎯 CreateModal PopoverContent focused');
                  }}
                  ref={(ref) => {
                    if (ref) {
                      console.log('📊 CreateModal PopoverContent ref:', {
                        computedStyle: window.getComputedStyle(ref),
                        zIndex: window.getComputedStyle(ref).zIndex,
                        backgroundColor: window.getComputedStyle(ref).backgroundColor,
                        opacity: window.getComputedStyle(ref).opacity
                      });
                    }
                  }}
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      console.log('📆 CreateModal Date selected:', { date });
                      setDate(date);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {getFieldError("sent_date") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("sent_date")}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                className={`rounded-xl ${status === "pending" ? "status-pending" : ""}`}
                variant={status === "pending" ? "default" : "secondary"}
                onClick={() => setStatus("pending")}
              >
                Pending
              </Button>
              <Button
                type="button"
                className={`rounded-xl ${status === "sent" ? "status-sent" : ""}`}
                variant={status === "sent" ? "default" : "secondary"}
                onClick={() => setStatus("sent")}
              >
                Sent
              </Button>
              <Button
                type="button"
                className={`rounded-xl ${status === "rejected" ? "status-rejected" : ""}`}
                variant={status === "rejected" ? "default" : "secondary"}
                onClick={() => setStatus("rejected")}
              >
                Rejected
              </Button>
              <Button
                type="button"
                className={`rounded-xl ${status === "interview_scheduled" ? "status-interview-scheduled" : ""}`}
                variant={status === "interview_scheduled" ? "default" : "secondary"}
                onClick={() => setStatus("interview_scheduled")}
              >
                Interview Scheduled
              </Button>
              <Button
                type="button"
                className={`rounded-xl ${status === "interviewing" ? "status-interviewing" : ""}`}
                variant={status === "interviewing" ? "default" : "secondary"}
                onClick={() => setStatus("interviewing")}
              >
                Interviewing
              </Button>
              <Button
                type="button"
                className={`rounded-xl ${status === "offer" ? "status-offer" : ""}`}
                variant={status === "offer" ? "default" : "secondary"}
                onClick={() => setStatus("offer")}
              >
                Offer
              </Button>
              <input type="hidden" name="Status" value={status} />
            </div>
            <div>
              <textarea 
                className={cn(
                  "input p-4", 
                  getFieldError("notes") && "border-red-500"
                )} 
                placeholder="Notes" 
                name="Notes" 
              />
              {getFieldError("notes") && (
                <span className="text-sm text-red-600 mt-1 block">{getFieldError("notes")}</span>
              )}
            </div>
          </div>
          <DialogFooter className="justify-between justify-center">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="default" type="submit">Create new application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ApplicationCreateModal;
