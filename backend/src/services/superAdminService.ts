import { prisma } from "../config/database";
import { BadRequestError, ForbiddenError, NotFoundError } from "../utils/error";

export class SuperAdminService {
  /**
   * Get all admin accounts.
   *
   * This intentionally returns only administrative accounts,
   * rather than every user in the system.
   */
  async getAdmins(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "SUPER_ADMIN"],
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.user.count({
        where: {
          role: {
            in: ["ADMIN", "SUPER_ADMIN"],
          },
        },
      }),
    ]);

    return {
      admins,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Deactivate or reactivate an ADMIN account.
   *
   * A SUPER_ADMIN account cannot be modified through this operation.
   */
  async updateAdminStatus(actorId: string, adminId: string, isActive: boolean) {
    if (actorId === adminId) {
      throw new BadRequestError("You cannot change your own account status");
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin) {
      throw new NotFoundError("Admin account not found");
    }

    if (admin.role === "SUPER_ADMIN") {
      throw new ForbiddenError(
        "A SUPER_ADMIN account cannot be modified through this operation",
      );
    }

    if (admin.role !== "ADMIN") {
      throw new BadRequestError("Target user is not an admin account");
    }

    if (admin.isActive === isActive) {
      return admin;
    }

    return prisma.user.update({
      where: {
        id: adminId,
      },
      data: {
        isActive,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Remove an ADMIN account.
   *
   * SUPER_ADMIN accounts cannot be deleted through this operation.
   */
  async deleteAdmin(actorId: string, adminId: string) {
    if (actorId === adminId) {
      throw new BadRequestError("You cannot delete your own account");
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!admin) {
      throw new NotFoundError("Admin account not found");
    }

    if (admin.role === "SUPER_ADMIN") {
      throw new ForbiddenError(
        "A SUPER_ADMIN account cannot be deleted through this operation",
      );
    }

    if (admin.role !== "ADMIN") {
      throw new BadRequestError("Target user is not an admin account");
    }

    await prisma.user.delete({
      where: {
        id: adminId,
      },
    });

    return {
      id: adminId,
      deleted: true,
    };
  }
}

export const superAdminService = new SuperAdminService();
