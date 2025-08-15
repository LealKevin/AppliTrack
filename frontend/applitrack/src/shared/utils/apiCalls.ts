import type { UserInput } from "@/features/authentication/hooks/useConnection";
import type { IApplication, ApplicationCounts, Round, CreateRoundRequest, UpdateRoundRequest, InterviewApplication, Reminder, CreateReminderRequest, UpdateReminderRequest, ReminderWithApplication } from "@/shared/types/api";
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
): Promise<InterviewApplication[]> {
  const response = await apiClient.get<InterviewApplication[]>(
    `/api/applications?status=${status ?? ""}`
  );
  return response.data;
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

export async function getAppsCount(): Promise<ApplicationCounts> {
  const response = await apiClient.get<ApplicationCounts>("/api/applications/count");
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

// Rounds API functions
export async function fetchRounds(applicationId: string): Promise<Round[]> {
  const response = await apiClient.get<{ Application: any; Rounds: Round[] | null }>(`/api/applications/${applicationId}/rounds`);
  return response.data.Rounds || [];
}

export async function createRound(applicationId: string, roundData: CreateRoundRequest): Promise<Round> {
  const response = await apiClient.post<Round>(`/api/application/${applicationId}/rounds`, roundData);
  return response.data;
}

export async function updateRound(roundId: string, roundData: UpdateRoundRequest): Promise<Round> {
  const response = await apiClient.put<Round>(`/api/rounds/${roundId}`, roundData);
  return response.data;
}

export async function deleteRound(roundId: string): Promise<void> {
  await apiClient.delete(`/api/rounds/${roundId}`);
}

export async function fetchInterviewApplications(): Promise<InterviewApplication[]> {
  const response = await apiClient.get<InterviewApplication[]>("/api/interviews");
  return response.data;
}

// Reminder API functions
export async function createReminder(reminderData: CreateReminderRequest): Promise<Reminder> {
  console.log("Creating reminder with data:", reminderData);
  
  // Transform data to match backend ReminderReq struct
  const backendRequest = {
    status: "pending",  // Default status as expected by backend
    reminder_date: new Date(reminderData.reminder_date).toISOString(),
    application_id: reminderData.application_id
  };
  
  console.log("Transformed request for backend:", backendRequest);
  const response = await apiClient.post<Reminder>("/api/reminders", backendRequest);
  return response.data;
}

export async function fetchUserReminders(): Promise<Reminder[]> {
  const response = await apiClient.get<Reminder[]>("/api/reminders");
  return response.data;
}

export async function updateReminder(reminderId: string, reminderData: UpdateReminderRequest): Promise<Reminder> {
  // Transform data to match backend ReminderReq struct
  const backendRequest = {
    status: reminderData.status || "pending",
    reminder_date: new Date(reminderData.reminder_date).toISOString(),
    // Backend expects application_id but doesn't use it for updates, so provide dummy if missing
    application_id: reminderData.application_id || "00000000-0000-0000-0000-000000000000"
  };
  
  console.log("Updating reminder with data:", backendRequest);
  const response = await apiClient.put<Reminder>(`/api/reminders/${reminderId}`, backendRequest);
  return response.data;
}

export async function completeReminder(reminderId: string): Promise<void> {
  await apiClient.put(`/api/reminders/${reminderId}/complete`);
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await apiClient.delete(`/api/reminders/${reminderId}`);
}

export async function fetchDueReminders(): Promise<ReminderWithApplication[]> {
  const response = await apiClient.get<ReminderWithApplication[]>("/api/reminders/due");
  return response.data;
}
