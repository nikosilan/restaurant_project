import pool from "../../utils/database.js";

const checkDatabase = async () => {
  await pool.execute("SELECT 1");
};

export { checkDatabase };
