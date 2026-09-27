import { z } from "zod";

export const updateAvailabilitySchema = z.object({
  body: z.object({
    isAvailable: z.boolean({
      error: (issue) =>
        issue.input === undefined
          ? "isAvailable is required"
          : "isAvailable must be a boolean",
    }),
  }),
});

export const updateBloodTypeSchema = z.object({
  body: z.object({
    bloodType: z.enum(
      [
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
        "O_POSITIVE",
        "O_NEGATIVE",
      ],
      {
        error: (issue) =>
          issue.input === undefined
            ? "bloodType is required"
            : "Invalid blood type",
      },
    ),
  }),
});

export const updateDonorProfileSchema = z.object({
  body: z.object({
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    dateOfBirth: z.iso.datetime().optional().or(z.date().optional()),
    phone: z.string().min(7).max(20).optional(),
    city: z.string().min(1).max(100).optional(),
    state: z.string().min(1).max(100).optional(),
    country: z.string().min(1).max(100).optional(),
    smsOptIn: z.boolean().optional(),
  }),
});
