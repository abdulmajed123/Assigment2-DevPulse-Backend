import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";
import sendResponse from "../utility/sendResponse";

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Missing, expired, or invalid JWT token",
        errors: "User authentication required for this operation",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Valid token but insufficient role/permissions",
        errors: `Role '${user.role}' does not have permission to access this resource`,
      });
    }

    next();
  };
};
