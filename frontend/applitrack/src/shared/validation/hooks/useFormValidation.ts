import { useState } from "react";
import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: Record<string, string[]>;
}

export interface FormValidationHook<T> {
  validate: (data: unknown) => ValidationResult<T>;
  errors: Record<string, string[]>;
  clearErrors: () => void;
  getFieldError: (fieldName: string) => string | undefined;
}

/**
 * Custom hook for form validation using Zod schemas
 * Provides type-safe validation with field-level error handling
 */
export function useFormValidation<T>(schema: ZodSchema<T>): FormValidationHook<T> {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const validate = (data: unknown): ValidationResult<T> => {
    try {
      const result = schema.parse(data);
      setErrors({});
      return {
        success: true,
        data: result,
        errors: {}
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = error.flatten().fieldErrors as Record<string, string[]>;
        setErrors(fieldErrors);
        return {
          success: false,
          data: null,
          errors: fieldErrors
        };
      }
      
      // Handle unexpected errors
      const unexpectedError = { _form: ["An unexpected validation error occurred"] };
      setErrors(unexpectedError);
      return {
        success: false,
        data: null,
        errors: unexpectedError
      };
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const fieldErrors = errors[fieldName];
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
  };

  return {
    validate,
    errors,
    clearErrors,
    getFieldError
  };
}

/**
 * Helper function to validate FormData objects
 * Converts FormData to plain object for Zod validation
 */
export function validateFormData<T>(
  formData: FormData,
  schema: ZodSchema<T>,
  transformer?: (formData: FormData) => unknown
): ValidationResult<T> {
  try {
    const data = transformer 
      ? transformer(formData)
      : Object.fromEntries(formData);
    
    const result = schema.parse(data);
    return {
      success: true,
      data: result,
      errors: {}
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        data: null,
        errors: error.flatten().fieldErrors as Record<string, string[]>
      };
    }
    
    return {
      success: false,
      data: null,
      errors: { _form: ["An unexpected validation error occurred"] }
    };
  }
}