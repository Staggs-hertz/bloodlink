import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response => {
  /*
   * Custom operational errors
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      details: err.details ?? {},
      ...(process.env.NODE_ENV === "development" && {
        stack: err.stack,
      }),
    });
  }

  /*
   * Prisma known request errors
   *
   * Prisma errors expose a `code` property. Handle the
   * application-relevant codes without exposing database
   * implementation details to the client.
   */
  if (err && typeof err === "object" && "code" in err) {
    const prismaError = err as {
      code: string;
    };

    if (prismaError.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with this value already exists",
        code: "CONFLICT",
        details: {},
      });
    }

    if (prismaError.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        code: "NOT_FOUND",
        details: {},
      });
    }
  }

  /*
   * JWT errors
   */
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "UNAUTHORIZED",
      details: {},
    });
  }

  /*
   * Unexpected errors
   *
   * Never expose internal error messages or stack traces
   * in production.
   */
  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    code: "INTERNAL_SERVER_ERROR",
    details: {},
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
