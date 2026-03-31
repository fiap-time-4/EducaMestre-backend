import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../util/appError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Validation error",
        issues: err.issues.map(issue => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      }
    });
  }

  // Custom application error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode
      }
    });
  }

  // Unknown error
  console.error(err);

  return res.status(500).json({
    error: {
      message: "Internal server error",
      statusCode: 500
    }
  });
}