import { getUser, type UserType } from "@/utils/apiCalls";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function useUser() {
	const [user, setUser] = useState<UserType | null>(null);
	const query = useQuery<UserType>({
		queryKey: ["user"],
		queryFn: getUser,
		onSuccess: (data: UserType) => {
			setUser(data);
		},
	});

	return { ...query, user };
}
