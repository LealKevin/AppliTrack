import type { UserInput } from "@/features/authentication/hooks/useConnection";
import type { IApplication } from "@/features/applications/pages/ApplicationsPage";
import axios from "axios";

let csrfToken: string | null = null;

async function fetchCSRFToken(): Promise<string> {
  if (!csrfToken) {
    const response = await axios.get<{ token: string }>("/api/csrf", {
      withCredentials: true
    });
    csrfToken = response.data.token;
  }
  console.log("CSRF Token fetched:", csrfToken);
  return csrfToken;
}

const apiClient = axios.create({
  withCredentials: true
});

apiClient.interceptors.request.use(async (config) => {
  if (config.method !== 'get' && config.method !== 'GET') {
    try {
      const token = await fetchCSRFToken();
      config.headers['X-CSRF-Token'] = token;
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
      csrfToken = null;
    }
    return Promise.reject(error);
  }
);
type IUser = {
  id: number;
  name: string;
  email: string;
};

export async function fetchApplications(
  status: string,
): Promise<IApplication[]> {
  const response = await apiClient.get<{ applications: IApplication[] }>(
    `/api/applications?status=${status ?? ""}`
  );
  return response.data.applications;
}

export async function deleteApplication(id: string): Promise<IApplication[]> {
  const response = await apiClient.delete<{ applications: IApplication[] }>(`/api/applications/${id}`);
  return response.data.applications;
}

export async function fetchApplicationsByStatus(status: string) {
  const response = await apiClient.get<{ applications: IApplication[] }>(
    `/api/applications/${status}`
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
  const response = await apiClient.post<IApplication>("/api/application", applicationRequest);
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
  const response = await apiClient.put<IApplication>(`/api/applications/${application.id}`, {
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
  const response = await apiClient.post<CreateUserResponse>(
    "/api/register",
    {
      name: newName,
      email: newEmail,
      password: newPassword,
      passwordRepeat: newPassWordRepeat,
    }
  );
  return response.data;
}

export async function connectUser(
  input: UserInput,
): Promise<CreateUserResponse> {
  const response = await apiClient.post<CreateUserResponse>(
    "/api/login",
    {
      email: input.email,
      password: input.password,
    }
  );

  return response.data;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post("/api/logout", {});
}

export type UserType = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export async function getUser(): Promise<UserType> {
  const response = await apiClient.get<UserType>("/api/user/current");
  return response.data;
}

export type AppsCount = {
  all_count: number;
  sent_count: number;
  pending_count: number;
  rejected_count: number;
};
export async function getAppsCount(): Promise<AppsCount> {
  const response = await apiClient.get<AppsCount>("/api/applications/count");
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

  const response = await apiClient.post<ImportResult>("/api/application/import", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
