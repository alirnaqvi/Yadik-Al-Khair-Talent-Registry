import { z } from "zod";
import {
  DEGREES,
  GENDERS,
  INDUSTRIES,
  MAX_AGE,
  MIN_AGE,
  PROFESSIONS,
} from "@/lib/constants";

/** A required pick from a fixed list. Matching ignores case so "it" still finds "IT". */
function pick<T extends readonly [string, ...string[]]>(list: T, message: string) {
  return z
    .string()
    .trim()
    .refine((v) => list.some((o) => o.toLowerCase() === v.toLowerCase()), { message })
    .transform((v) => list.find((o) => o.toLowerCase() === v.toLowerCase()) as T[number]);
}

export const cvFormSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the full name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  // "domain" is the stored name for the Profession field.
  domain: pick(PROFESSIONS, "Choose a profession from the list"),
  industry: pick(INDUSTRIES, "Choose an industry from the list"),
  degree: pick(DEGREES, "Choose your highest degree from the list"),
  gender: pick(GENDERS, "Choose a gender option from the list"),
  age: z
    .union([z.string(), z.number()])
    .transform((v) => (typeof v === "string" ? v.trim() : String(v)))
    .refine((v) => /^\d{1,3}$/.test(v), { message: "Enter your age as a whole number" })
    .transform((v) => Number(v))
    .refine((v) => v >= MIN_AGE && v <= MAX_AGE, {
      message: `Enter an age between ${MIN_AGE} and ${MAX_AGE}`,
    }),
  pwd: z
    .union([z.string(), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true" || v === "on"),
  experienceYears: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v)))
    .refine((v) => v === undefined || (Number.isFinite(v) && v >= 0 && v <= 60), {
      message: "Enter a realistic number of years",
    }),
  currentRole: z.string().trim().max(120).optional().or(z.literal("")),
  currentCompany: z.string().trim().max(120).optional().or(z.literal("")),
  education: z.string().trim().max(200).optional().or(z.literal("")),
  skills: z.string().trim().max(500).optional().or(z.literal("")),
  // "city" is the stored name for the Location field.
  city: z.string().trim().min(2, "Enter your location").max(80),
});

export type CVFormValues = z.infer<typeof cvFormSchema>;
