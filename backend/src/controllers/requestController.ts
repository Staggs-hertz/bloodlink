import { Request, Response, NextFunction } from "express";
import { sendSuccess, sendCreated, sendPaginated } from "../utils/response";
import { requestService } from "../services/requestService";

export class RequestController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await requestService.createRequest(
        req.user!.userId,
        req.body,
      );

      sendCreated({
        res,
        message: "Blood request submitted successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await requestService.getAllRequests(page, limit);

      sendPaginated({
        res,
        message: "Blood requests retrieved successfully",
        data: result.requests,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMine(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Math.min(Number(req.query.limit) || 20, 100);

      const result = await requestService.getMyRequests(
        req.user!.userId,
        page,
        limit,
      );

      sendPaginated({
        res,
        message: "Your blood requests retrieved successfully",
        data: result.requests,
        total: result.total,
        page: result.page,
        limit: result.limit,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const request = await requestService.getRequestById(
        req.params.id,
        req.user!.userId,
        req.user!.role,
      );

      sendSuccess({
        res,
        message: "Blood request retrieved successfully",
        data: request,
      });
    } catch (error) {
      next(error);
    }
  }

  async approve(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await requestService.approveRequest(
        req.params.id,
        req.body.donorId,
      );

      sendSuccess({
        res,
        message: "Blood request approved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async reject(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await requestService.rejectRequest(req.params.id);

      sendSuccess({
        res,
        message: "Blood request rejected successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const requestController = new RequestController();
