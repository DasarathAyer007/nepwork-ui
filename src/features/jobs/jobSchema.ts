import { z } from 'zod';

export const JOB_TYPES = [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'freelance',
] as const;
export const WORK_MODES = ['onsite', 'remote', 'hybrid'] as const;
export const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'] as const;
export const JOB_STATUSES = ['draft', 'open', 'paused', 'closed'] as const;

const keyValueEntrySchema = z.object({
  key: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const jobFormSchema = z
  .object({
    // Step 1 — Basics
    title: z
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(100),
    description: z
      .string()
      .trim()
      .min(20, 'Give a bit more detail (at least 20 characters)')
      .max(3000, 'Keep it under 3000 characters'),
    category: z.string().min(1, 'Select a category'),
    thumbnail: z.instanceof(File).nullable(),

    // Step 2 — Job details
    job_type: z.enum(JOB_TYPES, { required_error: 'Choose a job type' }),
    work_mode: z.enum(WORK_MODES, { required_error: 'Choose a work mode' }),
    experience_level: z.enum(EXPERIENCE_LEVELS, {
      required_error: 'Choose an experience level',
    }),
    experience_years: z.coerce
      .number()
      .min(0, "Can't be negative")
      .max(50)
      .optional(),

    // Step 3 — Skills & compensation
    skills_required: z
      .array(z.string())
      .min(1, 'Add at least one required skill'),
    requirements: z.array(keyValueEntrySchema).default([]),
    salary_min: z.coerce.number().min(0).optional(),
    salary_max: z.coerce.number().min(0).optional(),
    currency: z.string().min(1).default('USD'),
    benefits: z.array(keyValueEntrySchema).default([]),

    // Step 4 — Location & status
    location: z.object({
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      address: z.string().optional().default(''),
      city: z.string().optional().default(''),
      state: z.string().optional().default(''),
      country: z.string().optional().default(''),
      postal_code: z.string().optional().default(''),
    }),
    deadline: z.string().nullable().optional(),
    contact_email: z
      .string()
      .trim()
      .email('Enter a valid email')
      .optional()
      .or(z.literal('')),
    contact_phone: z.string().trim().optional().default(''),
    status: z.enum(JOB_STATUSES).default('draft'),
  })
  .superRefine((data, ctx) => {
    if (
      data.salary_min != null &&
      data.salary_max != null &&
      data.salary_min > data.salary_max
    ) {
      ctx.addIssue({
        path: ['salary_min'],
        code: z.ZodIssueCode.custom,
        message: 'Min salary must be less than or equal to max',
      });
    }
  });

export type JobFormValues = z.infer<typeof jobFormSchema>;

export const defaultJobFormValues: JobFormValues = {
  title: '',
  description: '',
  category: '',
  thumbnail: null,
  job_type: 'full_time',
  work_mode: 'onsite',
  experience_level: 'entry',
  experience_years: undefined,
  skills_required: [],
  requirements: [],
  salary_min: undefined,
  salary_max: undefined,
  currency: 'USD',
  benefits: [],
  location: {
    lat: null,
    lng: null,
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  },
  deadline: null,
  contact_email: '',
  contact_phone: '',
  status: 'draft',
};

export const jobStepFields: Record<
  number,
  (keyof JobFormValues | `location.${string}`)[]
> = {
  1: ['title', 'description', 'category'],
  2: ['job_type', 'work_mode', 'experience_level', 'experience_years'],
  3: ['skills_required', 'salary_min', 'salary_max'],
  4: ['contact_email'],
  5: [],
};
