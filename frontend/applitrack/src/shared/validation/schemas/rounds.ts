import { z } from "zod";
import type { RoundType, RoundStatus } from "@/shared/types/api";

// Round type enum matching backend validation and API types
const roundTypeEnum = z.enum([
  "phone_screen",
  "technical", 
  "onsite",
  "final"
] as const);

// Round status enum matching API types (we may need to sync backend with these)
const roundStatusEnum = z.enum([
  "scheduled",
  "completed",
  "passed",
  "failed"
] as const);

// Round outcome enum matching backend validation
const roundOutcomeEnum = z.enum([
  "pass",
  "fail", 
  "pending"
] as const);

// Create round validation schema - matches backend RoundRequest validation
export const createRoundSchema = z.object({
  title: z
    .string()
    .min(2, "Round title must be at least 2 characters long")
    .max(255, "Round title is too long"),
  type: roundTypeEnum,
  status: roundStatusEnum,
  date: z
    .string()
    .min(1, "Date is required")
    .datetime("Please select a valid date"),
  notes: z
    .string()
    .optional(),
  interviewer: z
    .string()
    .optional(),
  duration: z
    .string()
    .optional(),
  outcome: roundOutcomeEnum
    .optional(),
  application_id: z
    .string()
    .uuid("Invalid application ID")
});

// Update round validation schema - matches backend UpdateRoundRequest validation
export const updateRoundSchema = createRoundSchema.extend({
  id: z.string().uuid("Invalid round ID")
});

// Type exports for form data
export type CreateRoundFormData = z.infer<typeof createRoundSchema>;
export type UpdateRoundFormData = z.infer<typeof updateRoundSchema>;

// Helper function to validate FormData from HTML forms
export function parseRoundFormData(formData: FormData, applicationId: string, selectedType: RoundType, selectedStatus: RoundStatus, selectedDate: string) {
  return {
    title: formData.get("title") as string,
    type: selectedType,
    status: selectedStatus,
    date: selectedDate,
    notes: formData.get("notes") as string || undefined,
    interviewer: formData.get("interviewer") as string || undefined,
    duration: formData.get("duration") as string || undefined,
    outcome: formData.get("outcome") as string || undefined,
    application_id: applicationId
  };
}