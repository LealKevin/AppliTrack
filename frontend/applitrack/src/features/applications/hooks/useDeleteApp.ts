import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/shared/utils/apiCalls";

export default function useDeleteApp() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      queryClient.invalidateQueries({
        queryKey: ["appsCount"],
      });
    },
    onError: (error) => {
      console.error("Failed to delete application:", error);
    },
  });
  return mutation;
}
