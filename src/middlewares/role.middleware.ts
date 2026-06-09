import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./auth.middleware";

// এই মিডলওয়্যারটি এলাউড রোলগুলোর একটি তালিকা (Array) রিসিভ করবে
export const requireRoles = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    // ১. জাস্ট ডাবল চেক করা যে ইউজার আগের মিডলওয়্যার (authMiddleware) পার হয়ে এসেছে কি না
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Missing, expired, or invalid JWT token",
      });
    }

    // ২. ইউজারের রোলটি এলাউড রোলের তালিকায় আছে কিনা চেক করা
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Valid token but insufficient role/permissions", // রিকোয়ারমেন্টের হুবহু মেসেজ
      });
    }

    // রোল ম্যাচ করলে পরের কাজের (Controller-এ) অনুমতি দেওয়া হবে
    next();
  };
};
