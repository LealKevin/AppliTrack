import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import OffersPage from "./pages/OffersPage";
import StatsPage from "./pages/StatsPage";
import ApplicationsPage from "./pages/ApplicationsPage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/offers" element={<OffersPage />} />
				<Route path="/applications" element={<ApplicationsPage />} />
				<Route path="/stats" element={<StatsPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
