import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
	const { isLoading, isAuthenticated } = useAuth();

	if (isLoading) {
		return <div>Is Loading</div>;
	}

	if (!isAuthenticated) {
		return <Navigate to={"/login"} />;
	}

	return <Outlet />;
}
