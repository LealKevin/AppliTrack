import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StatsPage from "./pages/StatsPage";
import { ThemeProvider } from "./contexts/themeProvider";
import SigninPage from "./pages/SigninPage";
import MainPage from "./pages/MainPage";
import { Temp } from "./pages/Temp";
import LoginPage from "./pages/LoginPage";
import { ProtectedRoute } from "./pages/ProtectedRoutes";
import { CheckUser } from "./pages/CheckUser";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
