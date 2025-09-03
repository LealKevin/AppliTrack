import { useMutation, useQueryClient } from "@tanstack/react-query";
import { importApplicationsFromCSV } from "@/shared/utils/apiCalls";
import { toast } from "sonner";

export default function useImportApplications() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (file: File) => {
			toast.loading("Importing applications...", { id: "import-loading" });
			return importApplicationsFromCSV(file);
		},
		onSuccess: () => {
			toast.success("Applications imported successfully", { id: "import-loading" });
			queryClient.invalidateQueries({ queryKey: ["applications"] });
			queryClient.invalidateQueries({ queryKey: ["appsCount"] });
		},
		onError: (error) => {
			toast.error("Failed to import applications", { id: "import-loading" });
			console.error("Failed to import applications:", error);
		},
	});

	return mutation;
}