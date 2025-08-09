import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/components/HomePage";
import StatsPage from "../features/analytics/pages/StatsPage";
import { ThemeProvider } from "../shared/contexts/themeProvider";
import SigninPage from "../features/authentication/pages/SigninPage";
import MainPage from "../shared/components/MainPage";
import { Temp } from "../features/applications/pages/Temp";
import LoginPage from "../features/authentication/pages/LoginPage";
import { ProtectedRoute } from "../features/authentication/pages/ProtectedRoutes";
import { CheckUser } from "../features/authentication/pages/CheckUser";
import RoundsPage from "../features/applications/pages/RoundsPage";

function App() {
	return (
		<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
			<BrowserRouter>
				<Routes>
					<Route element={<CheckUser />}>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/signin" element={<SigninPage />} />
					</Route>

					<Route element={<ProtectedRoute />}>
						<Route element={<MainPage />}>
							<Route path="/" element={<HomePage />} />
							<Route path="/applications" element={<Temp />} />
							<Route path="/stats" element={<StatsPage />} />
							<Route path="/rounds" element={<RoundsPage />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
