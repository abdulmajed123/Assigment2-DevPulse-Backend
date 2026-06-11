import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middlewares/auth.middleware";
import {
  createIssueInDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  findIssueByIdRaw,
  updateIssueInDB,
  deleteIssueFromDB,
} from "./issues.service";
import sendResponse from "../../utility/sendResponse";

// Create Issue
export const createIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reporterId = req.user!.id;
    const result = await createIssueInDB(req.body, reporterId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get All Issues
export const getAllIssues = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllIssuesFromDB(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get Single Issue
export const getSingleIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await getSingleIssueFromDB(id);

    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update Issue (Strict Permission Checking)
export const updateIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;

    const existingIssue = await findIssueByIdRaw(id);
    if (!existingIssue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
      });
    }

    if (user.role === "contributor") {
      if (existingIssue.reporter_id !== user.id) {
        return sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Valid token but insufficient role/permissions",
        });
      }

      if (existingIssue.status !== "open") {
        return sendResponse(res, {
          statusCode: 409,
          success: false,
          message: "Business logic conflict (cannot edit non-open issue)",
        });
      }
    }

    const updatedIssue = await updateIssueInDB(id, req.body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: updatedIssue,
    });
  } catch (error: any) {
    next(error);
  }
};

//  Delete Issue
export const deleteIssue = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const user = req.user!;

    if (user.role !== "maintainer") {
      return sendResponse(res, {
        statusCode: 403,
        success: false,
        message: "Valid token but insufficient role/permissions",
      });
    }

    const existingIssue = await findIssueByIdRaw(id);
    if (!existingIssue) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Requested resource does not exist",
      });
    }

    await deleteIssueFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};
