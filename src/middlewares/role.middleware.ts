import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Missing, expired, or invalid JWT token",
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Valid token but insufficient role/permissions",
      });
    }

    next();
  };
};
