import { z } from "zod";

export const updateHospitalProfileSchema = z.object({
  body: z
    .object({
      address: z.string().trim().min(1).max(255).optional(),
      city: z.string().trim().min(1).max(100).optional(),
      state: z.string().trim().min(1).max(100).optional(),
      country: z.string().trim().min(1).max(100).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "Provide at least one field to update",
    ),
});
