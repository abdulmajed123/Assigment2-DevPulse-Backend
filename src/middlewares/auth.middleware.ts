import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config"; // আপনার config ফাইলের পাথ অনুযায়ী ঠিক করে নিন

// Express Request ইন্টারফেসকে এক্সটেন্ড করা যাতে req.user ব্যবহার করা যায়
export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  // ১. হেডার থেকে টোকেন নেওয়া
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing, expired, or invalid JWT token",
    });
  }

  // "Bearer <token>" থেকে শুধু টোকেনটা আলাদা করা
  const token = authHeader.split(" ")[1];

  try {
    // ২. টোকেন ভেরিফাই করা
    const decoded = jwt.verify(
      token as string,
      config.jwt_secret as string,
    ) as any;

    // ৩. রিকোয়ারমেন্টের Hint অনুযায়ী পে-লোড থেকে id, name, role 'req.user' এ সেট করা
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    next(); // সব ঠিক থাকলে পরের ধাপে পাঠানো
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Missing, expired, or invalid JWT token",
    });
  }
};
