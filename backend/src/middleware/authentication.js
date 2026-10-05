import jwt from "jsonwebtoken";
import "dotenv/config";

import { findUserById } from "../api/models/user-model.js";

const authToken = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    response.sendStatus(401);
    return;
  }

  let tokenUser;

  try {
    tokenUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    response.status(403).json({ error: "Invalid token" });
    return;
  }

  if (!Number.isInteger(Number(tokenUser.id)) || Number(tokenUser.id) <= 0) {
    response.status(403).json({ error: "Invalid token" });
    return;
  }

  try {
    const currentUser = await findUserById(tokenUser.id);

    if (!currentUser) {
      response.status(401).json({ error: "User account is no longer active." });
      return;
    }

    response.locals.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

export { authToken };
