import type { IApplication } from "@/pages/ApplicationsPage";
import axios from "axios";

// This function is used to fetch all applications from the server
export async function fetchApplications(
	status: string,
): Promise<IApplication[]> {
	const response = await axios.get<IApplication[]>(
		`api/applications?status=${status ?? ""}`,
	);
	return response.data;
}

// This function is used to delete an application from the server
export async function deleteApplication(id: number): Promise<IApplication[]> {
	const response = await axios.delete<IApplication[]>(`api/applications/${id}`);
	return response.data;
}

// This function is used to fetch applications by status from the server
export async function fetchApplicationsByStatus(status: string) {
	const response = await axios.get<IApplication[]>(
		`api/applications/${status}`,
	);
	return response.data;
}
