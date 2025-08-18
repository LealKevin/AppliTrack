import { z } from "zod";
import type { ApplicationStatus } from "@/shared/types/api";

// Application status enum matching backend validation
const applicationStatusEnum = z.enum([
  "sent",
  "pending", 
  "rejected",
  "interview_scheduled",
  "interviewing",
  "offer"
] as const);

// Create application validation schema - matches backend CreateApplicationRequest validation
export const createApplicationSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(255, "Title is too long"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters long")
    .max(255, "Company name is too long"),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters long")
    .max(255, "Location is too long"),
  sent_date: z
    .string()
    .min(1, "Date is required")
    .datetime("Please select a valid date"),
  status: applicationStatusEnum,
  notes: z
    .string()
    .optional(),
  url_application: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal(""))
});

// Update application validation schema - matches backend UpdateApplicationRequest validation
export const updateApplicationSchema = createApplicationSchema.extend({
  id: z.string().uuid("Invalid application ID")
});

// Type exports for form data
export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationFormData = z.infer<typeof updateApplicationSchema>;

// Helper function to validate FormData from HTML forms
export function parseApplicationFormData(formData: FormData) {
  return {
    title: formData.get("TitleApplication") as string,
    company: formData.get("Company") as string,
    location: formData.get("Location") as string,
    sent_date: formData.get("sent_date") as string,
    status: formData.get("Status") as ApplicationStatus,
    notes: formData.get("Notes") as string || undefined,
    url_application: formData.get("UrlApplication") as string || undefined
  };
}