import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 5000;

app.use(express.json());

initDB();
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Assignment Project",
    author: "Abdul Majed",
  });
});

app.post("/", (req: Request, res: Response) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  res.status(201).json({
    message: "User Create Successfully",
    data: { name, email },
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
