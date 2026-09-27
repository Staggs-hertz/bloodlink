import { z } from "zod";

export const updateInventorySchema = z.object({
  params: z.object({
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
        error: "bloodType is required",
      },
    ),
  }),
  body: z.object({
    unitsAvailable: z.number().int().min(0, "Units cannot be negative"),
  }),
});
