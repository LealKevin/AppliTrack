import type { IApplication } from "@/pages/ApplicationsPage";
import axios from "axios";

// This function is used to fetch all applications from the server
export async function fetchApplications(): Promise<IApplication[]> {
	const response = await axios.get<IApplication[]>("api/applications");
	return response.data;
}

// This function is used to delete an application from the server
export async function deleteApplication(id: number): Promise<IApplication[]> {
	console.log("From delete application", id);
	const response = await axios.delete<IApplication[]>(`api/applications/${id}`);
	return response.data;
}
