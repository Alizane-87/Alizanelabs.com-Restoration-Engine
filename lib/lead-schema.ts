import { z } from "zod";

export const afterHoursHandlingOptions = [
  { value: "voicemail", label: "Voicemail" },
  { value: "owner-phone", label: "Owner phone" },
  { value: "answering-service", label: "Answering service" },
  { value: "other", label: "Other" },
] as const;

export const monthlyCallRangeOptions = [
  { value: "unknown", label: "Not sure" },
  { value: "0-10", label: "0–10" },
  { value: "11-30", label: "11–30" },
  { value: "31-75", label: "31–75" },
  { value: "76+", label: "76+" },
] as const;

export const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name").max(80),
  company: z.string().trim().min(1, "Enter your company name").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email")
    .max(160)
    .email("Enter a valid work email"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number we can reach you on")
    .max(32)
    .regex(/^[0-9+()\-.\s]+$/, "Use digits, spaces, and + ( ) - . only"),
  serviceArea: z.string().trim().min(1, "Enter your primary service area").max(120),
  afterHoursHandling: z.enum(
    afterHoursHandlingOptions.map((option) => option.value) as [string, ...string[]],
    { errorMap: () => ({ message: "Select how after-hours calls are handled today" }) },
  ),
  monthlyCallRange: z
    .enum(monthlyCallRangeOptions.map((option) => option.value) as [string, ...string[]])
    .optional(),
  crm: z.string().trim().max(120).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you about the audit" }),
  }),
  /** Honeypot. Must stay empty. */
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;

export function toFieldErrors(error: z.ZodError): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in errors)) {
      errors[key as keyof LeadInput] = issue.message;
    }
  }
  return errors;
}
