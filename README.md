# 🚼 DevPulse – Internal Tech Issue & Feature Tracker

DevPulse is a collaborative, high-performance platform built for software teams to report bugs, suggest features, coordinate resolutions, and manage development workflows seamlessly.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://devpulse-api.vercel.app)

---

## 🚀 Key Features

- **Strict Role-Based Access Control (RBAC):** Separate permissions for `contributor` and `maintainer` roles.
- **Secure JWT Authentication:** Stateless authentication flow with hashed passwords using bcrypt and custom token expiration handling via `.env`.
- **Dynamic SQL Querying:** Pure PostgreSQL execution using native `pg` pool driver (No ORMs, Query Builders, or SQL JOINs).
- **Comprehensive Issue Management:** Supports creating, updating, and filtering issues by type (`bug`, `feature_request`) and status (`open`, `in_progress`, `resolved`).
- **Standardized API Responses:** Clean and predictable global JSON structures for both success and error payloads.

---

## 🛠️ Tech Stack

| Technology           | Purpose                                                      |
| :------------------- | :----------------------------------------------------------- |
| **Node.js (v24.x+)** | Production-ready LTS JavaScript runtime                      |
| **TypeScript**       | Strongly typed programming language for bulletproof scaling  |
| **Express.js**       | Minimalist and modular web framework                         |
| **PostgreSQL**       | Relational database system                                   |
| **Native PG Driver** | Raw SQL optimization using connection pooling (`pool.query`) |
| **JSONWebToken**     | Secure, stateless user authentication                        |
| **BcryptJS**         | Industrial grade password hashing                            |

---

## 🗄️ Database Schema Summary

### 1. `users` Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
2. issues Table
SQL
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('bug', 'feature_request')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    reporter_id INT NOT NULL, -- Validated in application logic
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
🌐 API Endpoints Specification
🔹 Authentication Module
POST /api/auth/signup - Register a new account (public)

POST /api/auth/login - Authenticate user & return JWT token (public)

🔹 Issues Module
POST /api/issues - Create a bug report or feature request (authenticated)

GET /api/issues - Retrieve all issues with sorting and filtering (public)

Query Params: ?sort=newest│oldest, ?type=bug│feature_request, ?status=open│in_progress│resolved

GET /api/issues/:id - Get full details of a specific issue (public)

PATCH /api/issues/:id - Update title, description, or type (Maintainer OR Owner Contributor if status is open)

DELETE /api/issues/:id - Permanently remove an issue (Maintainer only)

⚙️ Local Setup & Installation
Follow these steps to get the project running locally on your machine:

1. Clone the Repository
Bash
git clone [https://github.com/yourusername/devpulse.git](https://github.com/yourusername/devpulse.git)
cd devpulse
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env file in the root directory and populate it with your credentials:

Code snippet
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/devpulse_db
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
4. Run Database Migrations
Execute the SQL scripts provided in the Database Schema Summary section inside your PostgreSQL client or hosting platform (e.g., NeonDB/Supabase) to set up the tables properly.

5. Start the Server
Development Mode (with auto-reload):

Bash
npm run dev
Production Build:

Bash
npm run build
npm start
🚨 Response Patterns
Standard Success Structure (200 / 201)
JSON
{
  "success": true,
  "message": "Operation description",
  "data": {}
}
Standard Error Structure (400 / 401 / 403 / 404 / 409 / 500)
JSON
{
  "success": false,
  "message": "Error description",
  "errors": "Error details"
}
```
