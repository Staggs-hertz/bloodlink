import { prisma } from "../config/database";
import { NotFoundError } from "../utils/error";

export class NotificationService {
  async create(userId: string, message: string) {
    return prisma.notification.create({
      data: {
        userId,
        message,
        status: "SENT",
      },
    });
  }

  async getMyNotifications(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    const result = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        status: "READ",
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Notification not found");
    }

    return {
      id: notificationId,
      status: "READ",
    };
  }
}

export const notificationService = new NotificationService();
