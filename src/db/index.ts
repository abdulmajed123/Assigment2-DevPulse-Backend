import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

export const initDB = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `);

    //     await pool.query(`
    //     CREATE TABLE IF NOT EXISTS issues (
    //     id SERIAL PRIMARY KEY,
    //     title VARCHAR(255) NOT NULL,
    //     description TEXT NOT NULL,
    //     type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature')),
    //     status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    //     assignee_id INT REFERENCES users(id) ON DELETE SET NULL,
    //     creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    //     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    //     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    //   );
    // `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL, -- রিকোয়ারমেন্টে সর্বোচ্চ 150 ক্যারেক্টার বলা আছে
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL CHECK (type IN ('bug', 'feature_request')), -- রিকোয়ারমেন্টে feature_request বলা আছে
        status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
        reporter_id INT NOT NULL, -- রিকোয়ারমেন্টের রুল: (no foreign key constraint required; validate in application logic)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database Connected Successfully");
  } catch (error) {}
};
