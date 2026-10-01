import pool from "../../utils/database.js";

const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password_hash, role, language FROM users WHERE email = ?`,
    [email],
  );
  return rows[0];
};

const createUser = async (name, email, passwordHash) => {
  const [result] = await pool.execute(
    `INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`,
    [name, email, passwordHash],
  );
  return result.insertId;
};

export { createUser, findUserByEmail };
