import type { IApplication } from "../pages/ApplicationsPage";
import { updateApplication } from "@/shared/utils/apiCalls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateApp() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["applications"],
    mutationFn: (application: IApplication) => updateApplication(application),
    onMutate: async (_newApp) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const previousApps = queryClient.getQueryData(["applications"]);
      queryClient.setQueryData(["applications"], (old: IApplication[] | undefined) =>
        old?.map(app => app.id === _newApp.id ? _newApp : app) ?? []
      );
      return { previousApps };
    },
    onError: (err, _newApp, context) => {
      if (context?.previousApps) {
        queryClient.setQueryData(["applications"], context.previousApps);
      }
      console.error("Failed to update application:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["appsCount"] });
      queryClient.invalidateQueries({ queryKey: ["interviewApplications"] });

    },
  });

  return mutation;
}
