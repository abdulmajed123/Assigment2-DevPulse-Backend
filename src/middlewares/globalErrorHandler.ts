import type { Request, Response, NextFunction } from "express";
import sendResponse from "../utility/sendResponse";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  sendResponse(res, {
    statusCode,
    success: false,
    message,
    errors: err.errors || err.message || "Something went wrong",
  });
};
