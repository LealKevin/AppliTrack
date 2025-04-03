import type { IApplication } from "@/pages/ApplicationsPage";
import axios from "axios";
type IUser = {
	id: number;
	name: string;
	email: string;
};

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

// This function is used to create an application from the server
export async function createApplication(application: IApplication) {
	const response = await axios.post<IApplication>("api/application", {
		...application,
		UserID: 1,
	});
	return response.data;
}

type CreateUserResponse = {
	user: IUser;
	token: string;
};

export async function createUser(
	newName: string,
	newEmail: string,
	newPassword: string,
	newPassWordRepeat: string,
): Promise<CreateUserResponse> {
	const response = await axios.post<CreateUserResponse>(
		"api/users",
		{
			name: newName,
			email: newEmail,
			password: newPassword,
			passwordRepeat: newPassWordRepeat,
		},
		{ withCredentials: true },
	);
	return response.data;
}

export async function connectUser(
	email: string,
	password: string,
): Promise<CreateUserResponse> {
	const response = await axios.post<CreateUserResponse>(
		"/api/login",
		{
			email: email,
			password: password,
		},
		{
			withCredentials: true,
		},
	);

	return response.data;
}

export async function logoutUser(): Promise<void> {
	console.log("hare");
	await axios.post("/api/logout", {}, { withCredentials: true });
}
