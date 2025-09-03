import type { IApplication } from "@/shared/types/api";
import { createApplication } from "@/shared/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCreateApplication() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["applications"],
    mutationFn: (application: IApplication) => createApplication(application),
    onSuccess: () => {
      toast.success("Application created successfully");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"] });
      queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });
    },
    onError: (error) => {
      toast.error("Failed to create application");
      console.error("Failed to create application:", error);
    },
  });

  return mutation;
}
