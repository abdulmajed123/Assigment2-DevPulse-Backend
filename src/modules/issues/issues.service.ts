import { pool } from "../../db";

//  Create Issue
export const createIssueInDB = async (
  issueData: { title: string; description: string; type: string },
  reporterId: number,
) => {
  const { title, description, type } = issueData;

  const query = `
    INSERT INTO issues (title, description, type, reporter_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
  `;

  const result = await pool.query(query, [
    title,
    description,
    type,
    reporterId,
  ]);
  return result.rows[0];
};

// Get All Issues (No JOIN Challenge)
export const getAllIssuesFromDB = async (filters: any) => {
  const { sort, type, status } = filters;

  let queryText = "SELECT * FROM issues WHERE 1=1";
  const queryParams: any[] = [];
  let paramIndex = 1;

  if (type) {
    queryText += ` AND type = $${paramIndex}`;
    queryParams.push(type);
    paramIndex++;
  }

  if (status) {
    queryText += ` AND status = $${paramIndex}`;
    queryParams.push(status);
    paramIndex++;
  }

  // Sorting
  queryText +=
    sort === "oldest"
      ? " ORDER BY created_at ASC"
      : " ORDER BY created_at DESC";

  const issueResult = await pool.query(queryText, queryParams);
  const issues = issueResult.rows;

  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];

  const userQuery = `SELECT id, name, role FROM users WHERE id IN (${reporterIds.map((_, i) => `$${i + 1}`).join(",")})`;
  const userResult = await pool.query(userQuery, reporterIds);
  const users = userResult.rows;

  return issues.map((issue) => {
    const reporter = users.find((u) => u.id === issue.reporter_id);
    const { reporter_id, ...issueData } = issue;
    return {
      ...issueData,
      reporter: reporter || null,
    };
  });
};

//  Get Single Issue
export const getSingleIssueFromDB = async (id: number) => {
  const issueResult = await pool.query("SELECT * FROM issues WHERE id = $1", [
    id,
  ]);
  const issue = issueResult.rows[0];

  if (!issue) return null;

  const userResult = await pool.query(
    "SELECT id, name, role FROM users WHERE id = $1",
    [issue.reporter_id],
  );
  const reporter = userResult.rows[0];

  const { reporter_id, ...issueData } = issue;
  return {
    ...issueData,
    reporter: reporter || null,
  };
};

export const findIssueByIdRaw = async (id: number) => {
  const result = await pool.query("SELECT * FROM issues WHERE id = $1", [id]);
  return result.rows[0];
};

export const updateIssueInDB = async (id: number, updateData: any) => {
  const { title, description, type } = updateData;
  const query = `
    UPDATE issues 
    SET title = $1, description = $2, type = $3, updated_at = NOW() 
    WHERE id = $4
    RETURNING id, title, description, type, status, reporter_id, created_at, updated_at;
  `;
  const result = await pool.query(query, [title, description, type, id]);
  return result.rows[0];
};

//  Delete Issue
export const deleteIssueFromDB = async (id: number) => {
  await pool.query("DELETE FROM issues WHERE id = $1", [id]);
};
