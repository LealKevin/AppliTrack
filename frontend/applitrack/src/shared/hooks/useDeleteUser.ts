import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "@/shared/utils/apiCalls";
import { useAuth } from "@/features/authentication/contexts/AuthContext";

export default function useDeleteUser() {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      queryClient.clear();
      await logout();
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
    },
  });

  return mutation;
}