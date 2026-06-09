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

// 🔹 ৩. Create Issue
export const createIssue = async (req: AuthRequest, res: Response) => {
  try {
    const reporterId = req.user!.id; // Auth Middleware থেকে টোকেনের ID নেওয়া হলো
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

// 🔹 ৪. Get All Issues
export const getAllIssues = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getAllIssuesFromDB(req.query);
    res.status(200).json({
      success: true,
      message: "Issues retrived successfully",
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

// 🔹 ৫. Get Single Issue
export const getSingleIssue = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await getSingleIssueFromDB(id);

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Requested resource does not exist" });
    }

    res.status(200).json({
      success: true,
      message: "Issue retrived successfully",
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

// 🔹 ৬. Update Issue (Strict Permission Checking)
export const updateIssue = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;

    const existingIssue = await findIssueByIdRaw(id);
    if (!existingIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Requested resource does not exist" });
    }

    // 🔐 স্পেশাল বিজনেস রুলস চেক:
    if (user.role === "contributor") {
      // কন্ট্রিবিউটর কি নিজের ইস্যু এডিট করছে?
      if (existingIssue.reporter_id !== user.id) {
        return res.status(403).json({
          success: false,
          message: "Valid token but insufficient role/permissions",
        });
      }
      // ইস্যুটা কি এখনও 'open' আছে?
      if (existingIssue.status !== "open") {
        return res.status(409).json({
          success: false,
          message: "Business logic conflict (cannot edit non-open issue)",
        });
      }
    }

    const updatedIssue = await updateIssueInDB(id, req.body);
    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};

// 🔹 ७. Delete Issue
export const deleteIssue = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;

    // ডিলিট করার ক্ষমতা শুধুমাত্র maintainer এর আছে
    if (user.role !== "maintainer") {
      return res.status(403).json({
        success: false,
        message: "Valid token but insufficient role/permissions",
      });
    }

    const existingIssue = await findIssueByIdRaw(id);
    if (!existingIssue) {
      return res
        .status(404)
        .json({ success: false, message: "Requested resource does not exist" });
    }

    await deleteIssueFromDB(id);
    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: error.message,
    });
  }
};
