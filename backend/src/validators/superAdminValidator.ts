import { z } from "zod";

export const superAdminUserIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid admin ID"),
  }),
});

export const superAdminPaginationSchema = z.object({
  query: z.object({
    page: z.coerce
      .number()
      .int()
      .min(1, "Page must be at least 1")
      .optional()
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1, "Limit must be at least 1")
      .max(100, "Limit cannot exceed 100")
      .optional()
      .default(20),
  }),
});

export const updateAdminStatusSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid admin ID"),
  }),

  body: z.object({
    isActive: z.boolean({
      error: (issue) =>
        issue.input === undefined
          ? "isActive is required"
          : "isActive must be a boolean",
    }),
  }),
});
