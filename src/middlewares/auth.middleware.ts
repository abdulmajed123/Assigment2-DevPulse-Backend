import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import sendResponse from "../utility/sendResponse";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    role: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Missing, expired, or invalid JWT token",

      errors: "Authorization header is missing or improperly formatted",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token as string,
      config.jwt_secret as string,
    ) as any;

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Missing, expired, or invalid JWT token",
      errors:
        error instanceof jwt.TokenExpiredError
          ? "Token has expired"
          : "Invalid token",
    });
  }
};
