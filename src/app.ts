import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Assignment Project",
    author: "Abdul Majed",
  });
});

app.use("/api/auth", authRoute);

export default app;
