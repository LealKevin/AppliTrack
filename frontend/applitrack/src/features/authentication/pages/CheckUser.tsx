import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function CheckUser() {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>Is loading</div>;
	}

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return <Outlet />;
}
