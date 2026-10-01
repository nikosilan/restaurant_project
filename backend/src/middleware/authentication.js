import jwt from "jsonwebtoken";
import "dotenv/config";

/**
 * Middleware to authenticate JWT tokens in incoming requests.
 * If the token is valid, the user information is attached to res.locals.user.
 * If the token is invalid or missing, an appropriate error response is sent.
 */

const authToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    response.sendStatus(401); // Unauthorized
    return;
  }

  try {
    response.locals.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    response.status(403).json({ error: "Invalid token" }); // Forbidden
  }
};

export { authToken };
