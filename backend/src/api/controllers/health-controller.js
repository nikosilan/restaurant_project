import { checkDatabase } from "../models/health-model.js";

const getHealth = async (_request, response) => {
  try {
    await checkDatabase();
    response.json({ status: "ok", database: "connected" });
  } catch (_error) {
    response.status(503).json({ status: "error", database: "unavailable" });
  }
};

export { getHealth };
