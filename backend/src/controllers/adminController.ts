import { Request, Response, NextFunction } from "express";
import { adminService } from "../services/adminService";
import { sendSuccess, sendPaginated } from "../utils/response";

export class AdminController {
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await adminService.getAllUsers(page, limit);

      sendPaginated({
        res,
        message: "Users retrieved successfully",
        data: result.users,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDashboardSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const summary = await adminService.getDashboardSummary();

      sendSuccess({
        res,
        message: "Dashboard summary retrieved successfully",
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUserStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await adminService.updateUserStatus(
        req.user!.userId,
        req.user!.role,
        req.params.id,
        req.body.isActive,
      );

      sendSuccess({
        res,
        message: "User status updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeUserRole(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await adminService.changeUserRole(
        req.user!.userId,
        req.params.id,
        req.body.role,
      );

      sendSuccess({
        res,
        message: "User role updated successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyInstitution(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await adminService.verifyInstitution(
        req.params.id,
        req.body.isVerifiedInstitution,
      );

      sendSuccess({
        res,
        message: "Institution verification status updated",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
