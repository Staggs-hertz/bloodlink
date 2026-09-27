import { prisma } from "../config/database";
import { NotFoundError, BadRequestError } from "../utils/error";
import { BloodType } from "../generated/prisma/client";

export class InventoryService {
  async getAll() {
    return prisma.bloodInventory.findMany({
      orderBy: { bloodType: "asc" },
    });
  }

  async updateUnits(bloodType: BloodType, unitsAvailable: number) {
    if (unitsAvailable < 0) {
      throw new BadRequestError("Units cannot be negative");
    }

    const inventory = await prisma.bloodInventory.findUnique({
      where: { bloodType },
    });

    if (!inventory) {
      throw new NotFoundError("Blood type not found in inventory");
    }

    return prisma.bloodInventory.update({
      where: { bloodType },
      data: { unitsAvailable },
    });
  }
}

export const inventoryService = new InventoryService();
