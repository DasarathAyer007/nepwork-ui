import { z } from 'zod';

export const serviceFormSchema = z
  .object({
    // Step 1 — Basics
    title: z
      .string()
      .trim()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Keep it under 100 characters'),
    description: z
      .string()
      .trim()
      .min(20, 'Give a bit more detail (at least 20 characters)')
      .max(2000, 'Keep it under 2000 characters'),
    category: z.string().uuid('Select a valid category'),
    thumbnail: z.instanceof(File).nullable(),

    // Step 2 — Pricing & skills
    price_type: z.enum(['fixed', 'hourly'], {
      required_error: 'Choose a pricing type',
    }),
    price: z.coerce.number().positive('Enter a valid amount').optional(),
    currency: z.string().min(1).default('USD'),
    skills: z.array(z.string()).min(1, 'Add at least one skill'),

    // Step 3 — Location
    location: z.object({
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      address: z.string().optional().default(''),
      city: z.string().optional().default(''),
      state: z.string().optional().default(''),
      country: z.string().optional().default(''),
      postal_code: z.string().optional().default(''),
    }),
    radius_km: z.coerce.number().min(1, 'Minimum 1 km').max(200, 'Max 200 km'),
    available_from: z.string().nullable().optional(),
    available_to: z.string().nullable().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
  })
  .superRefine((data, ctx) => {
    if (data.price_type === 'fixed' && !data.price) {
      ctx.addIssue({
        path: ['price'],
        code: z.ZodIssueCode.custom,
        message: 'Price is required for a fixed-price service',
      });
    }
    if (data.location.latitude == null || data.location.longitude == null) {
      ctx.addIssue({
        path: ['location', 'latitude'],
        code: z.ZodIssueCode.custom,
        message: 'Pick a location on the map',
      });
    }
  });

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export const defaultServiceFormValues: ServiceFormValues = {
  title: '',
  description: '',
  category: '',
  thumbnail: null,
  price_type: 'fixed',
  price: undefined,
  currency: 'USD',
  skills: [],
  location: {
    latitude: null,
    longitude: null,
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
  },
  radius_km: 10,
  available_from: null,
  available_to: null,
  status: 'active',
};

// Field names to validate before advancing off each step
export const stepFields: Record<
  number,
  (keyof ServiceFormValues | `${'location'}.${string}`)[]
> = {
  1: ['title', 'description', 'category'],
  2: ['price_type', 'price', 'skills'],
  3: ['location.latitude', 'radius_km'],
  4: [],
};
