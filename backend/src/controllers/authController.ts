import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService";
import { sendSuccess, sendCreated } from "../utils/response";

const REFRESH_TOKEN_DAYS = Number(process.env.JWT_REFRESH_TOKEN_DAYS) || 7;

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === "true",
  sameSite:
    (process.env.COOKIE_SAME_SITE as "lax" | "strict" | "none") || "lax",
  path: "/",
  maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
};

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await authService.register(req.body);

      sendCreated({
        res,
        message: "Registration successful. Please verify your email.",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      /*
       * Store the raw refresh token only in the HTTP-only cookie.
       * It is deliberately excluded from the JSON response.
       */
      res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

      sendSuccess({
        res,
        message: "Login successful",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      /*
       * Refresh tokens are accepted only from the HTTP-only cookie.
       */
      const token = req.cookies?.refreshToken;

      if (!token) {
        res.status(401).json({
          success: false,
          message: "Refresh token is required",
          code: "UNAUTHORIZED",
          details: {},
        });

        return;
      }

      const result = await authService.refreshToken(token);

      /*
       * Rotate the refresh token by replacing the old
       * HTTP-only cookie with the newly issued token.
       */
      res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

      /*
       * Never expose the refresh token in the JSON response.
       */
      sendSuccess({
        res,
        message: "Token refreshed successfully",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Authentication required",
          code: "UNAUTHORIZED",
          details: {},
        });

        return;
      }

      const user = await authService.getCurrentUser(req.user.userId);

      sendSuccess({
        res,
        message: "Current user retrieved successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      /*
       * Logout is intentionally cookie-based.
       * The refresh token is revoked server-side.
       */
      const token = req.cookies?.refreshToken;

      await authService.logout(token);

      /*
       * Remove the refresh-token cookie using the same
       * cookie attributes used when it was created.
       */
      res.clearCookie("refreshToken", refreshCookieOptions);

      sendSuccess({
        res,
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.query.token as string;

      const result = await authService.verifyEmail(token);

      sendSuccess({
        res,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async resendVerification(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await authService.resendVerification(req.body.email);

      sendSuccess({
        res,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
