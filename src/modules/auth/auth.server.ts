import { pool } from "../../db";
import type { IUser } from "./auth.interface";
import bcrypt from "bcryptjs";

export const craeteUserInDB = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  const hashPassword = await bcrypt.hash("password", 10);
  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *
    `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};
