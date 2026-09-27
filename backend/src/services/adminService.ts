import bcrypt from "bcryptjs";
import { prisma } from "../config/database";
import {
  ConflictError,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../utils/error";
import { Role } from "../generated/prisma/client";

const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export class AdminService {
  async getAllUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          organizationName: true,
          isEmailVerified: true,
          isVerifiedInstitution: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async getDashboardSummary() {
    const [
      totalUsers,
      activeUsers,
      totalDonors,
      totalHospitals,
      availableDonors,
      pendingRequests,
      matchedRequests,
      approvedRequests,
      fulfilledRequests,
      rejectedRequests,
      inventory,
      unreadNotifications,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          isActive: true,
        },
      }),

      prisma.user.count({
        where: {
          role: "DONOR",
        },
      }),

      prisma.user.count({
        where: {
          role: "HOSPITAL",
        },
      }),

      prisma.donorProfile.count({
        where: {
          isAvailable: true,
          user: {
            role: "DONOR",
            isActive: true,
          },
        },
      }),

      prisma.bloodRequest.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.bloodRequest.count({
        where: {
          status: "MATCHED",
        },
      }),

      prisma.bloodRequest.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.bloodRequest.count({
        where: {
          status: "FULFILLED",
        },
      }),

      prisma.bloodRequest.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.bloodInventory.findMany({
        orderBy: {
          bloodType: "asc",
        },
      }),

      prisma.notification.count({
        where: {
          status: "SENT",
        },
      }),
    ]);

    const lowStockThreshold = 3;

    const lowStockTypes = inventory.filter(
      (item) => item.unitsAvailable <= lowStockThreshold,
    );

    const totalBloodUnits = inventory.reduce(
      (total, item) => total + item.unitsAvailable,
      0,
    );

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },

      donors: {
        total: totalDonors,
        available: availableDonors,
      },

      hospitals: {
        total: totalHospitals,
      },

      requests: {
        pending: pendingRequests,
        matched: matchedRequests,
        approved: approvedRequests,
        fulfilled: fulfilledRequests,
        rejected: rejectedRequests,
      },

      inventory: {
        totalUnits: totalBloodUnits,
        lowStockTypes: lowStockTypes.length,
        lowStockThreshold,
        items: inventory,
      },

      notifications: {
        unread: unreadNotifications,
      },
    };
  }

  async updateUserStatus(
    actorId: string,
    actorRole: Role,
    userId: string,
    isActive: boolean,
  ) {
    if (actorId === userId) {
      throw new BadRequestError("You cannot change your own account status");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (
      actorRole === "ADMIN" &&
      (user.role === "ADMIN" || user.role === "SUPER_ADMIN")
    ) {
      throw new ForbiddenError(
        "Administrators cannot change the status of another administrator",
      );
    }

    if (actorRole === "SUPER_ADMIN" && user.role === "SUPER_ADMIN") {
      throw new ForbiddenError(
        "Super administrators cannot change another super administrator's status",
      );
    }

    /*
     * Update the account status and revoke all existing
     * refresh-token sessions when the account is deactivated.
     */
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { isActive },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!isActive) {
        await tx.refreshToken.updateMany({
          where: {
            userId,
            isRevoked: false,
          },
          data: {
            isRevoked: true,
          },
        });
      }

      return updatedUser;
    });

    return result;
  }

  async createAdmin(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const email = data.email.toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictError("Email is already registered");
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    return prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email,
        password: hashedPassword,
        role: "ADMIN",
        isEmailVerified: true,
        isActive: true,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  }

  async changeUserRole(
    actorId: string,
    userId: string,
    role: "DONOR" | "HOSPITAL" | "ADMIN",
  ) {
    if (actorId === userId) {
      throw new BadRequestError("You cannot change your own role");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "SUPER_ADMIN") {
      throw new ForbiddenError(
        "The role of a super administrator cannot be changed here",
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { role },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });

      /*
       * Changing a user's role invalidates all existing
       * refresh-token sessions. The user must log in again
       * to receive an access token containing the new role.
       */
      await tx.refreshToken.updateMany({
        where: {
          userId,
          isRevoked: false,
        },
        data: {
          isRevoked: true,
        },
      });

      return updatedUser;
    });

    return result;
  }

  async verifyInstitution(userId: string, isVerified: boolean) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        organizationName: true,
        registrationNumber: true,
        isVerifiedInstitution: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role !== "HOSPITAL" || !user.organizationName) {
      throw new BadRequestError(
        "User is not an institutional hospital account",
      );
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        isVerifiedInstitution: isVerified,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organizationName: true,
        registrationNumber: true,
        isVerifiedInstitution: true,
      },
    });
  }
}

export const adminService = new AdminService();
