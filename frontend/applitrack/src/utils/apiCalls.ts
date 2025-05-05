import type { UserInput } from "@/hooks/useConnection";
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

export async function deleteApplication(id: number): Promise<IApplication[]> {
	const response = await axios.delete<IApplication[]>(`api/applications/${id}`);
	return response.data;
}

export async function fetchApplicationsByStatus(status: string) {
	const response = await axios.get<IApplication[]>(
		`api/applications/${status}`,
	);
	return response.data;
}

//	TitleApplication string`json:"title"`
//	Company          string`json:"company"`
//	SentDate         string`json:"sent_date"`
//	Status           string`json:"status"`
//	Notes            string`json:"notes"`
//	UrlApplication   string`json:"url_application"`
//
type bodyRequest = {
	title: string;
	company: string;
	sent_date: number;
	status: string;
	notes: string | null;
	url_application: string;
};
export async function createApplication(application: IApplication) {
	const applicationRequest: bodyRequest = {
		title: application.TitleApplication,
		company: application.Company,
		sent_date: application.SentDate,
		status: application.Status,
		notes: application.Notes,
		url_application: application.UrlApplication,
	};
	const response = await axios.post<IApplication>("api/application", {
		...applicationRequest,
	});
	return response.data;
}

type CreateUserResponse = {
	user: IUser;
	token: string;
};

export async function updateApplication(application: IApplication) {
	const applicationRequest: bodyRequest = {
		title: application.TitleApplication,
		company: application.Company,
		sent_date: application.SentDate,
		status: application.Status,
		notes: application.Notes,
		url_application: application.UrlApplication,
	};
	const response = await axios.put<IApplication>(`api/applications`, {
		...applicationRequest,
	});
	return response.data;
}

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
	input: UserInput,
): Promise<CreateUserResponse> {
	const response = await axios.post<CreateUserResponse>(
		"/api/login",
		{
			email: input.email,
			password: input.password,
		},
		{
			withCredentials: true,
		},
	);

	return response.data;
}

export async function logoutUser(): Promise<void> {
	await axios.post("/api/logout", {}, { withCredentials: true });
}

export type UserType = {
	Name: string;
	Email: string;
};

export async function getUser(): Promise<UserType> {
	const response = await axios.get<UserType>("/api/me", {
		withCredentials: true,
	});
	console.log("Here");
	console.log({ response });
	return response.data;
}

export type AppsCount = {
	all_count: number;
	sent_count: number;
	pending_count: number;
	rejected_count: number;
};
export async function getAppsCount(): Promise<AppsCount> {
	console.log("Count count");
	const response = await axios.get<AppsCount>("api/applications/count", {
		withCredentials: true,
	});
	console.log(response.data);
	return response.data;
}
