import type { Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  findIssueByIdRaw,
  updateIssueInDB,
  deleteIssueFromDB,
} from "./issues.service";

// Create Issue
export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user!.id;
    const result = await createIssueInDB(req.body, reporterId);

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};
