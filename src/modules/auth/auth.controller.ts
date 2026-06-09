import type { Request, Response } from "express";
import { pool } from "../../db";
import { craeteUserInDB } from "./auth.server";

export const signup = async (req: Request, res: Response) => {
  // const { name, email, password, role } = req.body;

  try {
    const result = await craeteUserInDB(req.body);
    res.status(201).json({
      success: true,
      message: "User Created Successfully",
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
