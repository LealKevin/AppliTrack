
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
  url_application?: string;
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

export interface InterviewApplication {
  Application: IApplication;
  Rounds: Round[];
}

export interface CreateRoundRequest {
  title: string;
  type: RoundType;
  status: RoundStatus;
  date: string;
  notes?: string;
  interviewer?: string;
  duration?: string;
  outcome?: string;
  application_id: string;
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

export interface Reminder {
  id: string;
  reminder_date: string;
  status: ReminderStatus;
  application_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateReminderRequest {
  reminder_date: string;
  status: ReminderStatus;
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
  Application?: IApplication;
}

export interface ApplicationsResponse {
  applications: IApplication[];
}

export interface RoundsResponse {
  rounds: Round[];
}