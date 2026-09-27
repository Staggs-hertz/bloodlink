import { Request, Response, NextFunction } from "express";
import { donorService } from "../services/donorService";
import { sendSuccess, sendPaginated } from "../utils/response";

export class DonorController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await donorService.getAllDonors(page, limit);

      sendPaginated({
        res,
        message: "Donors retrieved successfully",
        data: result.donors,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await donorService.getMyProfile(req.user!.userId);
      sendSuccess({
        res,
        message: "Donor profile retrieved successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profile = await donorService.updateAvailability(
        req.user!.userId,
        req.body.isAvailable,
      );
      sendSuccess({
        res,
        message: "Availability updated successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBloodType(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profile = await donorService.updateBloodType(
        req.user!.userId,
        req.body.bloodType,
      );
      sendSuccess({
        res,
        message: "Blood type updated successfully",
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
      const profile = await donorService.updateProfile(
        req.user!.userId,
        req.body,
      );
      sendSuccess({
        res,
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const donorController = new DonorController();
