import type { UserInput } from "@/features/authentication/hooks/useConnection";
import type { IApplication } from "@/features/applications/pages/ApplicationsPage";
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

export async function deleteApplication(id: string): Promise<IApplication[]> {
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
  const applicationRequest = {
    title: application.title_application,
    company: application.company,
    location: application.location || "",
    sent_date: application.sent_date,
    status: application.status,
    notes: application.notes || "",
    url_application: application.url_application,
  };
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
  location: string;
  sent_date: string;
  status: string;
  notes?: string | null;
  url_application: string;
};

export async function updateApplication(application: IApplication) {
  const sentDate = new Date(application.sent_date).toISOString();
  
  const applicationRequest: bodyRequest = {
    title: application.title_application,
    company: application.company,
    location: application.location || "",
    sent_date: sentDate,
    status: application.status,
    notes: application.notes || "",
    url_application: application.url_application,
  };
  const response = await axios.put<IApplication>(`/api/applications/${application.id}`, {
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
  return response.data;
}

export type AppsCount = {
  all_count: number;
  sent_count: number;
  pending_count: number;
  rejected_count: number;
};
export async function getAppsCount(): Promise<AppsCount> {
  const response = await axios.get<AppsCount>("/api/applications/count", {
    withCredentials: true,
  });
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
