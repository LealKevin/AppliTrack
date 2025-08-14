import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";

export function CheckUser() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <div>Is loading</div>;
	}

	if (isAuthenticated) {
		navigate("/");
		return;
	}

	return <Outlet />;
}
