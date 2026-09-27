import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate = (schema: ZodType<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = data.body || req.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.slice(1).join("."),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
          code: "VALIDATION_ERROR",
        });
        return;
      }
      next(error);
    }
  };
};

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
          code: "VALIDATION_ERROR",
        });
        return;
      }
      next(error);
    }
  };
};
