import type { ReminderWithApplication } from "@/shared/types/api";

export interface ReminderDashboardData {
  overdue: ReminderWithApplication[];      // Past due date
  due_today: ReminderWithApplication[];    // Due today  
  due_this_week: ReminderWithApplication[]; // Due in next 7 days
  total_pending: number;
}

export interface ReminderUrgency {
  level: 'overdue' | 'today' | 'week' | 'future';
  color: 'red' | 'orange' | 'blue' | 'gray';
  icon: string;
  label: string;
  priority: number;
}

export const REMINDER_URGENCIES: Record<string, ReminderUrgency> = {
  overdue: {
    level: 'overdue',
    color: 'red', 
    icon: '🔴',
    label: 'Overdue',
    priority: 1
  },
  today: {
    level: 'today',
    color: 'orange',
    icon: '🟡', 
    label: 'Due Today',
    priority: 2
  },
  week: {
    level: 'week',
    color: 'blue',
    icon: '📅',
    label: 'This Week', 
    priority: 3
  },
  future: {
    level: 'future',
    color: 'gray',
    icon: '📋',
    label: 'Future', 
    priority: 4
  }
};