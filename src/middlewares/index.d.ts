import { AuthUser } from "../interfaces/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        role: string;
      };
    }
  }
}
