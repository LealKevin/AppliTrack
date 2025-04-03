import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function ProtectedRoute() {
	console.log("Protected route");
	const navigate = useNavigate();
	const { data: user } = useUser();
	console.log("user: ", user);

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
