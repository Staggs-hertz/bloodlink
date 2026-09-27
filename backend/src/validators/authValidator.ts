import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const registerSchema = z.object({
  body: z
    .object({
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

      password: passwordSchema,

      role: z.enum(["DONOR", "HOSPITAL"]).default("DONOR"),

      organizationName: z
        .string()
        .trim()
        .max(150, "Organization name cannot exceed 150 characters")
        .optional(),

      registrationNumber: z
        .string()
        .trim()
        .max(100, "Registration number cannot exceed 100 characters")
        .optional(),

      address: z
        .string()
        .trim()
        .max(200, "Address cannot exceed 200 characters")
        .optional(),

      city: z
        .string()
        .trim()
        .max(100, "City cannot exceed 100 characters")
        .optional(),

      state: z
        .string()
        .trim()
        .max(100, "State cannot exceed 100 characters")
        .optional(),

      country: z
        .string()
        .trim()
        .max(100, "Country cannot exceed 100 characters")
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.role === "HOSPITAL" && !data.organizationName) {
        ctx.addIssue({
          code: "custom",
          message: "Organization name is required for hospital accounts",
          path: ["organizationName"],
        });
      }
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email("Invalid email address")
      .transform((value) => value.toLowerCase()),

    password: z.string().min(1, "Password is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().trim().min(1, "Verification token is required"),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z
      .email("Invalid email address")
      .transform((value) => value.toLowerCase()),
  }),
});
