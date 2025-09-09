import { z } from "zod";

// Login validation schema - matches backend loginRequest validation
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
});

// Registration validation schema - matches backend RegisterRequest validation
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
  passwordRepeat: z
    .string()
    .min(1, "Please confirm your password"),
  acceptedPrivacyPolicy: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the privacy policy to create an account"
    }),
  acceptedTerms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the terms of service to create an account"
    })
}).refine((data) => data.password === data.passwordRepeat, {
  message: "Passwords don't match",
  path: ["passwordRepeat"]
});

// Type exports for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;