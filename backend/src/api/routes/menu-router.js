import express from "express";

import { getMenu } from "../controllers/menu-controller.js";

const router = express.Router();

router.route("/").get(getMenu);

export default router;
