// schemas.ts
import { z } from 'zod';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'];
const CURRENT_YEAR = new Date().getFullYear();

const optionalText = z.string().trim().optional();

const optionalImageFile = z
  .custom<File | null | undefined>(
    (val) => val === undefined || val === null || val instanceof File,
    { message: 'Expected an image file' }
  )
  .refine(
    (file) => !file || file.size <= MAX_IMAGE_SIZE,
    'Image must be less than 2MB'
  )
  .refine(
    (file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type),
    'Only JPEG, PNG or SVG images are allowed'
  )
  .transform((val) => val || undefined);

const socialLinkSchema = z.object({
  platform: z.string().trim().min(1),
  url: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: 'Invalid URL',
    }),
});

const commonProfileSchema = z.object({
  bio: optionalText,
  profilePic: optionalImageFile,
  coverPic: optionalImageFile,
  socialLinks: z.array(socialLinkSchema).optional(),
});

export const individualSchema = commonProfileSchema.extend({
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Enter a valid date',
    })
    .refine((value) => new Date(value) <= new Date(), {
      message: 'Date of birth cannot be in the future',
    }),
  gender: z
    .enum(['male', 'female', 'non-binary', 'prefer-not-to-say'], {
      message: 'Select a gender',
    })
    .optional(),
  skills: z
    .array(z.string().trim().min(1, 'Skill cannot be empty'))
    .min(1, 'Add at least one skill')
    .max(20, 'You can add up to 20 skills'),
  profileVisibility: z.enum(['public', 'private', 'connections']).optional(),
});

// ── Organization ─────────────────────────────────────────────────────────────
export const organizationSchema = commonProfileSchema.extend({
  industry: z.string().trim().min(1, 'Industry is required'),
  employeesCount: z.enum(['1-10', '11-50', '51-200', '201+'], {
    message: 'Select number of employees',
  }),
  foundedYear: z
    .union([z.string(), z.number()])
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === '' ||
        (Number(val) >= 1900 && Number(val) <= CURRENT_YEAR),
      `Year must be between 1900 and ${CURRENT_YEAR}`
    ),
  taxId: optionalText,
  address: optionalText, // simple office address string
  logo: optionalImageFile,
});

export type IndividualFormData = z.infer<typeof individualSchema>;
export type OrganizationFormData = z.infer<typeof organizationSchema>;
