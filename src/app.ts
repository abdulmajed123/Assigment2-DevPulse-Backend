import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";
import { IssueRoutes } from "./modules/issues/issues.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use((req, res, next) => {
  console.log("Time:", Date.now());
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Assignment Project",
    author: "Abdul Majed",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/issues", IssueRoutes);

// Global Error Handling Middleware
app.use(globalErrorHandler);
export default app;
