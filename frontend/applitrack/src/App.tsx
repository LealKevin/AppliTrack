import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OffersPage from "./pages/OffersPage";
import StatsPage from "./pages/StatsPage";
import { ThemeProvider } from "./contexts/themeProvider";
import SigninPage from "./pages/SigninPage";
import MainPage from "./pages/MainPage";
import { Temp } from "./pages/Temp";
import LoginPage from "./pages/LoginPage";

function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<BrowserRouter>
				<Routes>
					<Route element={<MainPage />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/applications" element={<Temp />} />
						<Route path="/stats" element={<StatsPage />} />
					</Route>

					<Route path="/signin" element={<SigninPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/offers" element={<OffersPage />} />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
