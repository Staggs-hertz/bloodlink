import { Request, Response, NextFunction } from "express";
import { hospitalService } from "../services/hospitalService";
import { sendSuccess } from "../utils/response";

export class HospitalController {
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await hospitalService.getMyProfile(req.user!.userId);

      sendSuccess({
        res,
        message: "Hospital profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profile = await hospitalService.updateMyProfile(
        req.user!.userId,
        req.body,
      );

      sendSuccess({
        res,
        message: "Hospital profile updated successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const hospitalController = new HospitalController();
