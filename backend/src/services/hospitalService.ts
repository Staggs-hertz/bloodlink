import { prisma } from "../config/database";
import { NotFoundError } from "../utils/error";

export class HospitalService {
  async getMyProfile(userId: string) {
    const hospital = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "HOSPITAL",
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organizationName: true,
        registrationNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        isVerifiedInstitution: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    if (!hospital) {
      throw new NotFoundError("Hospital profile not found");
    }

    return hospital;
  }

  async updateMyProfile(
    userId: string,
    data: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
    },
  ) {
    const hospital = await prisma.user.findFirst({
      where: {
        id: userId,
        role: "HOSPITAL",
      },
      select: {
        id: true,
      },
    });

    if (!hospital) {
      throw new NotFoundError("Hospital profile not found");
    }

    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        organizationName: true,
        registrationNumber: true,
        address: true,
        city: true,
        state: true,
        country: true,
        isVerifiedInstitution: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });
  }
}

export const hospitalService = new HospitalService();
