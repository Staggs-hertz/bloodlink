import { Request, Response, NextFunction } from "express";
import { notificationService } from "../services/notificationService";
import { sendSuccess, sendPaginated } from "../utils/response";

export class NotificationController {
  async getMine(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await notificationService.getMyNotifications(
        req.user!.userId,
        page,
        limit,
      );

      sendPaginated({
        res,
        message: "Notifications retrieved successfully",
        data: result.notifications,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user!.userId,
      );
      sendSuccess({
        res,
        message: "Notification marked as read",
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const notificationController = new NotificationController();
