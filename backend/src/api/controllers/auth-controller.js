import { createUser, findUserByEmail } from "../models/user-model.js";

const postRegister = async (request, response, next) => {
  const { name, email, password } = request.body;

  if (!name) {
    response.status(400).json({ error: "Name is required." });
    return;
  }
  if (name.length > 100) {
    response.status(400).json({ error: "Name must be under 100 characters." });
    return;
  }
  if (!email) {
    response.status(400).json({ error: "Email is required." });
    return;
  }
  if (email.length > 150) {
    response.status(400).json({ error: "Email must be under 150 characters." });
    return;
  }
  if (!email.includes("@")) {
    response
      .status(400)
      .json({ error: "Email must be a valid email address." });
    return;
  }
  if (!password) {
    response.status(400).json({ error: "Password is required." });
    return;
  }
  if (password.length < 8) {
    response
      .status(400)
      .json({ error: "Password must be at least 8 characters." });
    return;
  }
  const normalisedEmail = email.trim().toLowerCase();
  try {
    const userId = await createUser(name, normalisedEmail, password);

    response.status(201).json({ id: userId });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      response.status(409).json({ error: "Email is already in use." });
      return;
    }
    next(error);
  }
};

const postLogin = async (request, response, next) => {
  const { email, password } = request.body;

  if (!email) {
    response.status(400).json({ error: "Email is required." });
    return;
  }
  if (!password) {
    response.status(400).json({ error: "Password is required." });
    return;
  }

  const normalisedEmail = email.trim().toLowerCase();

  try {
    const user = await findUserByEmail(normalisedEmail);

    if (!user) {
      response.status(401).json({ error: "Invalid email or password." });
      return;
    }

    response.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
};

export { postRegister, postLogin };
