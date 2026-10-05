import express from "express";

import { authToken } from "../../middleware/authentication.js";
import {
  getMe,
  postLogin,
  postRegister,
} from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/register").post(postRegister);
router.route("/login").post(postLogin);
router.route("/me").get(authToken, getMe);

export default router;
