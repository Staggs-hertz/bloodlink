import { prisma } from "../config/database";
import { BloodType } from "../generated/prisma/enums";
import { NotFoundError, BadRequestError, ForbiddenError } from "../utils/error";
import { sendRequestApprovalEmail, sendDonorMatchEmail } from "./emailService";
import { notificationService } from "./notificationService";

const COMPATIBILITY: Record<BloodType, BloodType[]> = {
  O_NEGATIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE",
  ],
  O_POSITIVE: ["O_POSITIVE", "A_POSITIVE", "B_POSITIVE", "AB_POSITIVE"],
  A_NEGATIVE: ["A_NEGATIVE", "A_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  A_POSITIVE: ["A_POSITIVE", "AB_POSITIVE"],
  B_NEGATIVE: ["B_NEGATIVE", "B_POSITIVE", "AB_NEGATIVE", "AB_POSITIVE"],
  B_POSITIVE: ["B_POSITIVE", "AB_POSITIVE"],
  AB_NEGATIVE: ["AB_NEGATIVE", "AB_POSITIVE"],
  AB_POSITIVE: ["AB_POSITIVE"],
};

export class RequestService {
  async createRequest(
    hospitalId: string,
    data: {
      bloodType:
        | "A_POSITIVE"
        | "A_NEGATIVE"
        | "B_POSITIVE"
        | "B_NEGATIVE"
        | "AB_POSITIVE"
        | "AB_NEGATIVE"
        | "O_POSITIVE"
        | "O_NEGATIVE";
      urgency: "NORMAL" | "URGENT" | "CRITICAL";
      unitsNeeded: number;
      patientName: string;
      patientAge: number;
      patientGender: "MALE" | "FEMALE";
      patientReferenceNo: string;
      ward: string;
      notes?: string;
    },
  ) {
    const hospital = await prisma.user.findUnique({
      where: { id: hospitalId },
      select: {
        id: true,
        role: true,
        organizationName: true,
        isVerifiedInstitution: true,
      },
    });

    if (
      !hospital ||
      hospital.role !== "HOSPITAL" ||
      !hospital.organizationName ||
      !hospital.isVerifiedInstitution
    ) {
      throw new ForbiddenError(
        "Only verified hospitals or institutions can create blood requests",
      );
    }

    const request = await prisma.bloodRequest.create({
      data: {
        hospitalId,
        hospitalName: hospital.organizationName,

        bloodType: data.bloodType,
        urgency: data.urgency,
        unitsNeeded: data.unitsNeeded,

        patientName: data.patientName,
        patientAge: data.patientAge,
        patientGender: data.patientGender,
        patientReferenceNo: data.patientReferenceNo,

        ward: data.ward,

        notes: data.notes,
        status: "PENDING",
      },
    });

    return request;
  }

  async getAllRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        skip,
        take: limit,
        include: {
          hospital: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              organizationName: true,
            },
          },
          matchedDonor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.bloodRequest.count(),
    ]);

    return { requests, total, page, limit };
  }

  async getMyRequests(hospitalId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.bloodRequest.findMany({
        where: { hospitalId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.bloodRequest.count({
        where: { hospitalId },
      }),
    ]);

    return { requests, total, page, limit };
  }

  async getMyRequestSummary(hospitalId: string) {
    const [total, pending, matched, approved, fulfilled, rejected] =
      await Promise.all([
        prisma.bloodRequest.count({
          where: { hospitalId },
        }),
        prisma.bloodRequest.count({
          where: {
            hospitalId,
            status: "PENDING",
          },
        }),
        prisma.bloodRequest.count({
          where: {
            hospitalId,
            status: "MATCHED",
          },
        }),
        prisma.bloodRequest.count({
          where: {
            hospitalId,
            status: "APPROVED",
          },
        }),
        prisma.bloodRequest.count({
          where: {
            hospitalId,
            status: "FULFILLED",
          },
        }),
        prisma.bloodRequest.count({
          where: {
            hospitalId,
            status: "REJECTED",
          },
        }),
      ]);

    return {
      total,
      pending,
      matched,
      approved,
      fulfilled,
      rejected,
    };
  }

  async getRequestById(id: string, userId: string, role: string) {
    const request = await prisma.bloodRequest.findUnique({
      where: { id },
      include: {
        hospital: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationName: true,
          },
        },
        matchedDonor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundError("Blood request not found");
    }

    // Hospitals can only view their own requests.
    if (role === "HOSPITAL" && request.hospitalId !== userId) {
      throw new ForbiddenError("You can only view your own requests");
    }

    // Donors are not allowed to view blood requests directly.
    if (role === "DONOR") {
      throw new ForbiddenError(
        "You do not have permission to view blood requests",
      );
    }

    return request;
  }

  async getMatchingDonors(requestId: string) {
    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        bloodType: true,
        status: true,
        matchedDonorId: true,
      },
    });

    if (!request) {
      throw new NotFoundError("Blood request not found");
    }

    if (!["PENDING", "MATCHED"].includes(request.status)) {
      throw new BadRequestError(
        "Donors cannot be matched to a request in its current status",
      );
    }

    const compatibleDonorBloodTypes = Object.entries(COMPATIBILITY)
      .filter(([, recipientTypes]) =>
        recipientTypes.includes(request.bloodType),
      )
      .map(([donorBloodType]) => donorBloodType as BloodType);

    const donors = await prisma.donorProfile.findMany({
      where: {
        isAvailable: true,
        bloodType: {
          in: compatibleDonorBloodTypes,
        },
        user: {
          role: "DONOR",
          isActive: true,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          createdAt: "desc",
        },
      },
    });

    return donors;
  }

  async approveRequest(requestId: string, donorId: string) {
    const request = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: {
        hospital: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            organizationName: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundError("Blood request not found");
    }

    if (!["PENDING", "MATCHED"].includes(request.status)) {
      throw new BadRequestError(
        "Request cannot be approved in its current status",
      );
    }

    const donorProfile = await prisma.donorProfile.findUnique({
      where: { userId: donorId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });

    if (!donorProfile) {
      throw new NotFoundError("Donor profile not found");
    }

    if (donorProfile.user.role !== "DONOR") {
      throw new BadRequestError("Selected user is not a donor");
    }

    if (!donorProfile.user.isActive) {
      throw new BadRequestError("Selected donor account is inactive");
    }

    if (!donorProfile.isAvailable) {
      throw new BadRequestError("Selected donor is not available");
    }

    if (!donorProfile.bloodType) {
      throw new BadRequestError(
        "Selected donor does not have a blood type recorded",
      );
    }

    // Check blood compatibility.
    const canDonate = COMPATIBILITY[donorProfile.bloodType]?.includes(
      request.bloodType,
    );

    if (!canDonate) {
      throw new BadRequestError("Donor blood type is not compatible");
    }

    /*
     * Perform the approval, donor assignment, donor availability update,
     * and inventory deduction as one transaction.
     *
     * The inventory update uses a condition on unitsAvailable so that
     * two simultaneous approvals cannot both consume units that do not
     * actually exist.
     */
    const result = await prisma.$transaction(async (tx) => {
      // Re-check the request inside the transaction to protect against
      // two administrators approving the same request simultaneously.
      const currentRequest = await tx.bloodRequest.findUnique({
        where: { id: requestId },
        select: {
          status: true,
          bloodType: true,
          unitsNeeded: true,
        },
      });

      if (!currentRequest) {
        throw new NotFoundError("Blood request not found");
      }

      if (!["PENDING", "MATCHED"].includes(currentRequest.status)) {
        throw new BadRequestError("Request has already been processed");
      }

      /*
       * Re-check the donor inside the transaction.
       *
       * These checks protect against changes made between the initial
       * donor validation and the approval transaction.
       */
      const currentDonor = await tx.donorProfile.findUnique({
        where: { userId: donorId },
        select: {
          isAvailable: true,
          bloodType: true,
          user: {
            select: {
              role: true,
              isActive: true,
            },
          },
        },
      });

      if (!currentDonor) {
        throw new NotFoundError("Donor profile not found");
      }

      if (currentDonor.user.role !== "DONOR") {
        throw new BadRequestError("Selected user is not a donor");
      }

      if (!currentDonor.user.isActive) {
        throw new BadRequestError("Selected donor account is inactive");
      }

      if (!currentDonor.isAvailable) {
        throw new BadRequestError("Selected donor is no longer available");
      }

      if (!currentDonor.bloodType) {
        throw new BadRequestError(
          "Selected donor does not have a blood type recorded",
        );
      }

      // Re-check blood compatibility inside the transaction.
      const canDonate = COMPATIBILITY[currentDonor.bloodType]?.includes(
        currentRequest.bloodType,
      );

      if (!canDonate) {
        throw new BadRequestError("Donor blood type is not compatible");
      }

      /*
       * Only decrement inventory when enough units are available.
       * This avoids the race condition where two requests both read
       * the same available inventory before either one decrements it.
       */
      const inventoryUpdate = await tx.bloodInventory.updateMany({
        where: {
          bloodType: currentRequest.bloodType,
          unitsAvailable: {
            gte: currentRequest.unitsNeeded,
          },
        },
        data: {
          unitsAvailable: {
            decrement: currentRequest.unitsNeeded,
          },
        },
      });

      if (inventoryUpdate.count === 0) {
        throw new BadRequestError("Insufficient blood units in inventory");
      }

      const updatedRequest = await tx.bloodRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          matchedDonorId: donorId,
        },
      });

      /*
       * Once a donor has been assigned to an approved request,
       * mark the donor unavailable so the same donor cannot be
       * immediately assigned to another request.
       */
      await tx.donorProfile.update({
        where: { userId: donorId },
        data: {
          isAvailable: false,
        },
      });

      return updatedRequest;
    });

    // Notifications and emails are intentionally non-blocking.
    const bloodTypeLabel = request.bloodType.replace("_", " ");

    const hospitalMessage = `Your blood request for ${bloodTypeLabel} (${request.unitsNeeded} units) has been approved.`;

    const donorMessage = `You have been matched to a blood request needing ${bloodTypeLabel}. Please proceed to the designated donation center.`;

    notificationService
      .create(request.hospitalId, hospitalMessage)
      .catch(() => {});

    notificationService.create(donorId, donorMessage).catch(() => {});

    sendRequestApprovalEmail(
      request.hospital.email,
      request.hospital.firstName,
      request.bloodType,
      request.unitsNeeded,
      request.hospitalName,
    ).catch(() => {});

    sendDonorMatchEmail(
      donorProfile.user.email,
      donorProfile.user.firstName,
      request.bloodType,
    ).catch(() => {});

    return result;
  }

  async rejectRequest(requestId: string) {
    const result = await prisma.bloodRequest.updateMany({
      where: {
        id: requestId,
        status: {
          in: ["PENDING", "MATCHED"],
        },
      },
      data: {
        status: "REJECTED",
      },
    });

    if (result.count === 0) {
      const request = await prisma.bloodRequest.findUnique({
        where: { id: requestId },
        select: { id: true },
      });

      if (!request) {
        throw new NotFoundError("Blood request not found");
      }

      throw new BadRequestError(
        "Only pending or matched requests can be rejected",
      );
    }

    const rejectedRequest = await prisma.bloodRequest.findUnique({
      where: { id: requestId },
      include: {
        hospital: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        matchedDonor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!rejectedRequest) {
      throw new NotFoundError("Blood request not found");
    }

    return rejectedRequest;
  }
}

export const requestService = new RequestService();
