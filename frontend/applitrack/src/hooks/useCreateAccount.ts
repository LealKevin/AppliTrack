import { useMutation } from "@tanstack/react-query";

export function useCreateAccount() {
  const mutation = useMutation({
    mutationKey: (["users"]),
    mutationFn: (newName: string, newEmail: string, newPassword: string, newPassWordRepeat) => 
  });
}
