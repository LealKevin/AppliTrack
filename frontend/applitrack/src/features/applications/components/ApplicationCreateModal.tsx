import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import type { IApplication } from "../pages/ApplicationsPage";
import useCreateApplication from "../hooks/useCreateApplication";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { cn } from "@/shared/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/shared/components/ui/calendar";
import { format } from "date-fns";

type CreateModalProps = {
  isModalOpen: boolean;
  handleClose: () => void;
};

function ApplicationCreateModal({
  handleClose,
  isModalOpen,
}: CreateModalProps) {
  const [status, setStatus] = useState<"pending" | "sent" | "rejected">(
    "pending",
  );
  const [date, setDate] = useState<Date>();
  const sentDateFormatted = date
    ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString()
    : new Date().toISOString();


  const createApp = useCreateApplication();
  const handleCreateApplication = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newApplication: IApplication = {
      title_application: formData.get("TitleApplication") as string,
      company: formData.get("Company") as string,
      location: formData.get("Location") as string || "",
      url_application: formData.get("UrlApplication") as string,
      sent_date: sentDateFormatted,
      status: status,
      notes: formData.get("Notes") as string,
      id: "",
      created_at: "",
      updated_at: "",
    };
    await createApp.mutateAsync(newApplication);
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
            <Input name="TitleApplication" placeholder="Title" />
            <Input name="Company" placeholder="Company" />
            <Input name="Location" placeholder="Location" />
            <Input name="UrlApplication" placeholder="Application url" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "rounded-xl",
                    "input justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-muted w-auto p-0 rounded-sm">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex space-x-2  justify-center">
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
              <input type="hidden" name="Status" value={status} />
            </div>
            <textarea className="input p-4" placeholder="Notes" name="Notes" />
          </div>
          <DialogFooter className="justify-between justify-center">
            <Button variant="ghost" className="neu-button-destructive rounded-xl" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant={"ghost"} className="neu-button-primary rounded-xl" type="submit">Create new application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default ApplicationCreateModal;
