import { z } from "zod";

export const adminUserIdSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
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

export const changeRoleSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),

  body: z.object({
    role: z.enum(["DONOR", "HOSPITAL", "ADMIN"], {
      error: "Invalid role",
    }),
  }),
});

export const verifyInstitutionSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid user ID"),
  }),

  body: z.object({
    isVerifiedInstitution: z.boolean({
      error: (issue) =>
        issue.input === undefined
          ? "isVerifiedInstitution is required"
          : "isVerifiedInstitution must be a boolean",
    }),
  }),
});

export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),

    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});
