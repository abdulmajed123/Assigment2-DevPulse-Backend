import config from "../../config";
import { pool } from "../../db";
import type { ILoginInput, IUser } from "./auth.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const craeteUserInDB = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
    INSERT INTO users (name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING *
    `,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

// ==== Login User=====
export const loginUserFromDB = async (loginData: ILoginInput) => {
  const { email, password } = loginData;

  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as any,
  });
  const userData = { ...user };
  delete userData.password;
  return { token, user: userData };
};
