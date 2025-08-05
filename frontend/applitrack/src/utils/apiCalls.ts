import type { UserInput } from "@/hooks/useConnection";
import type { IApplication } from "@/pages/ApplicationsPage";
import axios from "axios";
type IUser = {
  id: number;
  name: string;
  email: string;
};

export async function fetchApplications(
  status: string,
): Promise<IApplication[]> {
  const response = await axios.get<{ applications: IApplication[] }>(
    `/api/applications?status=${status ?? ""}`,
    { withCredentials: true }
  );
  return response.data.applications;
}

export async function deleteApplication(id: number): Promise<IApplication[]> {
  const response = await axios.delete<{ applications: IApplication[] }>(`/api/applications/${id}`, { withCredentials: true });
  return response.data.applications;
}

export async function fetchApplicationsByStatus(status: string) {
  const response = await axios.get<{ applications: IApplication[] }>(
    `/api/applications/${status}`,
    { withCredentials: true }
  );
  return response.data.applications;
}

export async function createApplication(application: IApplication) {
  console.log("Creating application with data:", application);
  const applicationRequest = {
    title: application.TitleApplication,
    company: application.Company,
    sent_date: application.SentDate,
    status: application.Status,
    notes: application.Notes || "",
    url_application: application.UrlApplication,
  };
  console.log("Creating application with request:", applicationRequest);
  const response = await axios.post<IApplication>("/api/application", applicationRequest, { withCredentials: true });
  return response.data;
}

type CreateUserResponse = {
  user: IUser;
  token: string;
};

type bodyRequest = {
  title: string;
  company: string;
  sent_date: string;
  status: string;
  notes?: string | null;
  url_application: string;
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
  const response = await axios.put<IApplication>(`/api/applications`, {
    ...applicationRequest,
  }, { withCredentials: true });
  return response.data;
}

export async function createUser(
  newName: string,
  newEmail: string,
  newPassword: string,
  newPassWordRepeat: string,
): Promise<CreateUserResponse> {
  const response = await axios.post<CreateUserResponse>(
    "/api/register",
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
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export async function getUser(): Promise<UserType> {
  const response = await axios.get<UserType>("/api/user/current", {
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
  const response = await axios.get<AppsCount>("/api/applications/count", {
    withCredentials: true,
  });
  console.log(response.data);
  return response.data;
}

export type ImportResult = {
  total_records: number;
  success_count: number;
  failure_count: number;
  failures: string[];
};

export async function importApplicationsFromCSV(file: File): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post<ImportResult>("/api/application/import", formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
