import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "../shared/App.css";
import {QueryClientProvider} from "@tanstack/react-query";
import {UserConnectionModalProvider} from "../features/authentication/contexts/userConnectionModalProvider.tsx";
import {AuthProvider} from "../features/authentication/contexts/AuthContext.tsx";
import {queryClient} from "./queryClient.tsx";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<UserConnectionModalProvider>
				<AuthProvider>
					<App/>
				</AuthProvider>
			</UserConnectionModalProvider>
		</QueryClientProvider>
	</StrictMode>,
);
