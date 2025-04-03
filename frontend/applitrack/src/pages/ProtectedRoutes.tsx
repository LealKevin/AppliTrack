import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function ProtectedRoute() {
	const navigate = useNavigate();
	const { data: user } = useUser();

	useEffect(() => {
		if (!user) {
			navigate("/login");
		}
	}, [navigate, user]);

	if (user) {
		return <Outlet />;
	}

	return;
}
