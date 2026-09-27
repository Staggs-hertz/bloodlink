import { z } from "zod";

const adminPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

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

export const createAdminSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters"),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters"),

    email: z
      .email("Invalid email address")
      .transform((value) => value.toLowerCase()),

    password: adminPasswordSchema,
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
