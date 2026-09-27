import { z } from "zod";

const bloodTypeSchema = z.enum(
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
);

export const createRequestSchema = z.object({
  body: z.object({
    bloodType: bloodTypeSchema,

    urgency: z.enum(["NORMAL", "URGENT", "CRITICAL"]).default("NORMAL"),

    unitsNeeded: z
      .number()
      .int("Units needed must be a whole number")
      .min(1, "At least 1 unit is required")
      .max(50, "A maximum of 50 units can be requested at once"),

    hospitalName: z
      .string()
      .trim()
      .min(1, "Hospital name is required")
      .max(150, "Hospital name cannot exceed 150 characters"),

    notes: z
      .string()
      .trim()
      .max(500, "Notes cannot exceed 500 characters")
      .optional(),
  }),
});

export const approveRequestSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid request ID"),
  }),

  body: z.object({
    donorId: z.uuid("Invalid donor ID"),
  }),
});

export const rejectRequestSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid request ID"),
  }),
});
