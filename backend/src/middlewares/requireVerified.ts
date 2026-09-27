import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { ForbiddenError } from "../utils/error";

export const requireVerified = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new ForbiddenError("Authentication required"));
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { isEmailVerified: true },
    });

    if (!user || !user.isEmailVerified) {
      return next(
        new ForbiddenError("Email not verified", {
          code: "EMAIL_NOT_VERIFIED",
        }),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
