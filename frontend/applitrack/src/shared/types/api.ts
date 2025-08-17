// Core API response types matching backend exactly

export type ApplicationStatus = 
  | "pending" 
  | "sent" 
  | "interview_scheduled" 
  | "interviewing" 
  | "rejected" 
  | "offer";

export type RoundType = 
  | "phone_screen" 
  | "technical" 
  | "behavioral" 
  | "final" 
  | "onsite";

export type RoundStatus = 
  | "scheduled" 
  | "completed" 
  | "passed" 
  | "failed";

export type ReminderStatus = 
  | "pending" 
  | "completed";

export interface IApplication {
  id: string;
  title_application: string;
  company: string;
  location: string;
  sent_date: string;
  status: ApplicationStatus;
  notes?: string | null;
  url_application: string;
  created_at: string;
  updated_at: string;
}

export interface Round {
  id: string;
  application_id: string;
  title: string;
  type: RoundType;
  status: RoundStatus;
  date?: string | null;
  notes?: string;
  interviewer?: string;
  duration?: string;
  outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCounts {
  all_count: number;
  sent_count: number;
  pending_count: number;
  rejected_count: number;
  interview_scheduled_count: number;
  interviewing_count: number;
  offer_count: number;
}

// Interview application with rounds data included
export interface InterviewApplication {
  Application: IApplication;
  Rounds: Round[];
}

// API Request types - matches backend RoundRequest struct exactly
export interface CreateRoundRequest {
  title: string;
  type: RoundType;
  status: RoundStatus;
  date: string;            // Required: full ISO timestamp string
  notes?: string;          // Optional: will be sent as pointer in backend
  interviewer?: string;    // Optional: will be sent as pointer in backend
  duration?: string;       // Optional: will be sent as pointer in backend
  outcome?: string;        // Optional: will be sent as pointer in backend
  application_id: string;  // Required: UUID string
}

export interface UpdateRoundRequest extends CreateRoundRequest {
  id: string;
}

export interface CreateApplicationRequest {
  title: string;
  company: string;
  location: string;
  sent_date: string;
  status: ApplicationStatus;
  notes?: string;
  url_application?: string;
}

export interface UpdateApplicationRequest extends CreateApplicationRequest {
  id: string;
}

// Reminder types
export interface Reminder {
  id: string;
  reminder_date: string;         // ISO date string
  status: ReminderStatus;
  application_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderRequest {
  reminder_date: string;         // ISO date string
  status: ReminderStatus;        // Always 'pending' from frontend
  application_id: string;
}

export interface UpdateReminderRequest {
  reminder_date: string;
  status: ReminderStatus;
  application_id?: string;
}

export interface ReminderWithApplication {
  id: string;
  reminder_date: string;
  status: ReminderStatus;
  application_id: string;
  created_at: string;
  updated_at: string;
  Application: IApplication;     // Joined application data for rich notifications
}

// API Response wrappers
export interface ApplicationsResponse {
  applications: IApplication[];
}

export interface RoundsResponse {
  rounds: Round[];
}