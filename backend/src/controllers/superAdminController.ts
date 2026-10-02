import { Request, Response, NextFunction } from "express";
import { superAdminService } from "../services/superAdminService";
import { sendCreated, sendSuccess } from "../utils/response";

export class SuperAdminController {
  async createAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const admin = await superAdminService.createAdmin(req.body);

      sendCreated({
        res,
        message: "Admin account created successfully",
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAdmins(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      const result = await superAdminService.getAdmins(page, limit);

      sendSuccess({
        res,
        message: "Admin accounts retrieved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateAdminStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actorId = req.user!.userId;
      const adminId = req.params.id;
      const { isActive } = req.body;

      const result = await superAdminService.updateAdminStatus(
        actorId,
        adminId,
        isActive,
      );

      sendSuccess({
        res,
        message: isActive
          ? "Admin account activated successfully"
          : "Admin account deactivated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAdmin(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const actorId = req.user!.userId;
      const adminId = req.params.id;

      const result = await superAdminService.deleteAdmin(actorId, adminId);

      sendSuccess({
        res,
        message: "Admin account deleted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const superAdminController = new SuperAdminController();
