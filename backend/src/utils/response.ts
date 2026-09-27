import { Response } from "express";

interface SuccessResponseOptions {
  res: Response;
  message?: string;
  data?: unknown;
  statusCode?: number;
}

interface PaginatedResponseOptions {
  res: Response;
  message?: string;
  data: unknown[];
  total: number;
  page: number;
  limit: number;
  statusCode?: number;
}

export const sendSuccess = ({
  res,
  message = "Success",
  data = null,
  statusCode = 200,
}: SuccessResponseOptions): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendCreated = ({
  res,
  message = "Resource created successfully",
  data = null,
}: Omit<SuccessResponseOptions, "statusCode">): Response => {
  return sendSuccess({
    res,
    message,
    data,
    statusCode: 201,
  });
};

export const sendPaginated = ({
  res,
  message = "Success",
  data,
  total,
  page,
  limit,
  statusCode = 200,
}: PaginatedResponseOptions): Response => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  });
};
