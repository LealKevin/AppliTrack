import { createContext } from "react";
impart;

export const UserContext = createContext<{
	userName: string;
	logout: () => void;
}>({
	userName: "Not connected",
	logout: () => {},
});
