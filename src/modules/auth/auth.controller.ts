import type { Request, Response } from "express";

import { craeteUserInDB, loginUserFromDB } from "./auth.server";

export const signup = async (req: Request, res: Response) => {
  // const { name, email, password, role } = req.body;

  try {
    const result = await craeteUserInDB(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      errors: error,
    });
  }
};

// Login Controller
export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginUserFromDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token: result.token,
        user: result.user,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};
