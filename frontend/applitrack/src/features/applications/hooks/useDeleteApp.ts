import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/shared/utils/apiCalls";
import { toast } from "sonner";

export default function useDeleteApp() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      toast.success("Application deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["applications"], });
      queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"], });
    },
    onError: (error) => {
      toast.error("Failed to delete application");
      console.error("Failed to delete application:", error);
    },
  });
  return mutation;
}
