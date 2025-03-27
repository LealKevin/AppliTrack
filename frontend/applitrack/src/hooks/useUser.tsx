import { createContext } from "react";

export const UserContext = createContext<{
	userName: string;
	logout: () => void;
}>({
	userName: "Not connected",
	logout: () => {},
});
