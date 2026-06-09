import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRoles } from "../../middlewares/role.middleware";
import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
} from "./issues.controller";

const router = express.Router();

// 🔹 Public Endpoints (যে কেউ দেখতে পারবে)
router.get("/", getAllIssues);
router.get("/:id", getSingleIssue);

// 🔹 Protected Endpoints (লগইন করা ইউজার লাগবে এবং রোল চেক হবে)
router.post(
  "/",
  authMiddleware,
  requireRoles(["contributor", "maintainer"]),
  createIssue,
);
router.patch(
  "/:id",
  authMiddleware,
  requireRoles(["contributor", "maintainer"]),
  updateIssue,
);
router.delete(
  "/:id",
  authMiddleware,
  requireRoles(["maintainer"]),
  deleteIssue,
);

export const IssueRoutes = router;
