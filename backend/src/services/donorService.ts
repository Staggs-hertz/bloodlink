import { prisma } from "../config/database";
import { NotFoundError } from "../utils/error";
import { BloodType } from "../generated/prisma/client";

export class DonorService {
  async getAllDonors(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [donors, total] = await Promise.all([
      prisma.donorProfile.findMany({
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              isActive: true,
              createdAt: true,
            },
          },
        },
        orderBy: {
          user: {
            createdAt: "desc",
          },
        },
      }),
      prisma.donorProfile.count(),
    ]);

    return {
      donors,
      total,
      page,
      limit,
    };
  }

  async getMyProfile(userId: string) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            isEmailVerified: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundError("Donor profile not found");
    }

    return profile;
  }

  async updateAvailability(userId: string, isAvailable: boolean) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError("Donor profile not found");
    }

    return prisma.donorProfile.update({
      where: { userId },
      data: {
        isAvailable,
      },
    });
  }

  async updateBloodType(userId: string, bloodType: BloodType) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError("Donor profile not found");
    }

    return prisma.donorProfile.update({
      where: { userId },
      data: {
        bloodType,
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      gender?: "MALE" | "FEMALE";
      dateOfBirth?: string | Date;
      phone?: string;
      city?: string;
      state?: string;
      country?: string;
      smsOptIn?: boolean;
    },
  ) {
    const profile = await prisma.donorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError("Donor profile not found");
    }

    return prisma.donorProfile.update({
      where: { userId },
      data: {
        gender: data.gender,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        phone: data.phone,
        city: data.city,
        state: data.state,
        country: data.country,
        smsOptIn: data.smsOptIn,
      },
    });
  }
}

export const donorService = new DonorService();
