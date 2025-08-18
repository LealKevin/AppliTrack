import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import axios from "axios";
import { useState } from "react";
import type { IApplication } from "@/shared/types/api";

const iconPlus = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      fillRule="evenodd"
      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
);

const iconPen = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="size-6"
  >
    <path
      d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
    />
  </svg>
);

type CreateEditModalProps = {
  type: "create" | "edit";
  onSuccess: () => void;
  application?: IApplication;
};

function CreateEditModal({
  onSuccess,
  type,
  application,
}: CreateEditModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "sent" | "rejected">(
    "pending",
  );

  function handleEditSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("edit");
  }

  async function handleCreateSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post("api/application", {
        ...data,
        UserID: 1,
      });
      console.log(response.data);
    } catch (error) {
      console.log("EROOOOOR:", error);
    }
    onSuccess();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "create" ? (
          <Button
            variant="secondary"
            className="w-full flex border-b border-gray-200 m-2 p-4"
          >
            {iconPlus}
          </Button>
        ) : (
          <Button variant="outline" className="m-2 w-8 h-8">
            {iconPen}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {type.charAt(0).toUpperCase() + type.slice(1)} Application
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={type === "edit" ? handleEditSubmit : handleCreateSubmit}
        >
          <div className="grid gap-2 py-4">
            {type === "edit" && (
              <Label>
                <span>Company Name</span>
                <Input defaultValue={application?.title_application} />
              </Label>
            )}
            {type === "create" && (
              <>
                <span>Title</span>
                <div className="inputGroup">
                  <Input name="TitleApplication" />
                  <Label htmlFor="TitleApplication" >
                    Title Application
                  </Label>
                </div>
                <span>Company Name</span>
                <Label>
                  <Input name="Company" />
                </Label>
                <span>URL Website</span>
                <Label>
                  <Input name="UrlApplication" />
                </Label>
                <span>Sent Date</span>
                <Label>
                  <Input className="center" name="SentDate" type="date" />
                </Label>
                <hr className="m-4" />
                <span className="justify-center text-center">Status</span>
                <div className="flex space-x-2  justify-center">
                  <Button
                    type="button"
                    variant={status === "pending" ? "default" : "secondary"}
                    onClick={() => setStatus("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    type="button"
                    variant={status === "sent" ? "default" : "secondary"}
                    onClick={() => setStatus("sent")}
                  >
                    Sent
                  </Button>
                  <Button
                    type="button"
                    variant={status === "rejected" ? "default" : "secondary"}
                    onClick={() => setStatus("rejected")}
                  >
                    Rejected
                  </Button>
                  <input type="hidden" name="Status" value={status} />
                </div>
                <hr className="m-4" />
                <span>Notes</span>
                <Label>
                  <Input type="text" name="Notes" />
                </Label>
              </>
            )}
          </div>
          <DialogFooter className="justify-between justify-center">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {type === "create" ? "Create new application" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
export default CreateEditModal;
