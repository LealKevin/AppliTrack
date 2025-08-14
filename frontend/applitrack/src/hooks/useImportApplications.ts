import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importApplicationsFromCSV } from "@/utils/apiCalls";

export default function useImportApplications() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => importApplicationsFromCSV(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"] });
      queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });
    },
    onError: (error) => {
      console.error("Failed to import applications:", error);
    },
  });

  return mutation;
}
