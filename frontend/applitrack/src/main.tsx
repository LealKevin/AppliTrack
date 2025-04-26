import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserConnectionModalProvider } from "./contexts/userConnectionModalProvider.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserConnectionModalProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</UserConnectionModalProvider>
		</QueryClientProvider>
	</StrictMode>,
);
