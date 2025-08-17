import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../shared/components/HomePage";
import { ThemeProvider } from "../shared/contexts/themeProvider";
import SigninPage from "../features/authentication/pages/SigninPage";
import MainPage from "../shared/components/MainPage";
import ApplicationsPage from "../features/applications/pages/ApplicationsPage";
import LoginPage from "../features/authentication/pages/LoginPage";
import { ProtectedRoute } from "../features/authentication/pages/ProtectedRoutes";
import { CheckUser } from "../features/authentication/pages/CheckUser";
import RoundsPage from "../features/applications/pages/RoundsPage";
import InterviewsPage from "../features/applications/pages/InterviewsPage";
import RemindersPage from "../features/reminders/pages/RemindersPage";

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
							<Route path="/applications" element={<ApplicationsPage />} />
							<Route path="/rounds" element={<RoundsPage />} />
							<Route path="/interviews" element={<InterviewsPage />} />
							<Route path="/reminders" element={<RemindersPage />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
