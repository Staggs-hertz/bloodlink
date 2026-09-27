import { Request, Response, NextFunction } from "express";
import { inventoryService } from "../services/inventoryService";
import { sendSuccess } from "../utils/response";
import { BloodType } from "../generated/prisma/client";

export class InventoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.getAll();
      sendSuccess({
        res,
        message: "Inventory retrieved successfully",
        data: inventory,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request<{ bloodType: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await inventoryService.updateUnits(
        req.params.bloodType as BloodType,
        req.body.unitsAvailable,
      );
      sendSuccess({
        res,
        message: "Inventory updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
