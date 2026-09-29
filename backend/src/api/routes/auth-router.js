import express from "express";

import { postLogin, postRegister } from "../controllers/auth-controller.js";

const router = express.Router();

router.route("/register").post(postRegister);
router.route("/login").post(postLogin);

export default router;
