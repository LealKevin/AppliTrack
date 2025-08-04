import { format, parseISO, isValid } from "date-fns";

/**
 * Formats an ISO date string to dd/mm/yyyy format
 * @param isoString - ISO 8601 date string (e.g., "2025-08-04T00:00:00Z")
 * @returns Formatted date string (e.g., "04/08/2025") or "Invalid Date" if parsing fails
 */
export function formatDateToDDMMYYYY(isoString: string | null | undefined): string {
  if (!isoString) {
    return "No Date";
  }

  try {
    const date = parseISO(isoString);
    if (!isValid(date)) {
      return "Invalid Date";
    }
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.warn("Failed to parse date:", isoString, error);
    return "Invalid Date";
  }
}