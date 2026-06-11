import type { NextFunction, Request, Response } from "express";

import { craeteUserInDB, loginUserFromDB } from "./auth.server";
import sendResponse from "../../utility/sendResponse";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await craeteUserInDB(req.body);
    const { password, ...userWithoutPassword } = result.rows[0];
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    next(error);
  }
};

// Login Controller
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await loginUserFromDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    next(error);
  }
};
