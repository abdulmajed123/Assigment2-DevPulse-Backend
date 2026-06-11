// import type { NextFunction, Request, Response } from "express";

// const globalErrorHandler = (
//   err: any,
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// };

// export default globalErrorHandler;

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
    error: err.errors || err.message || "Something went wrong",
  });
};
