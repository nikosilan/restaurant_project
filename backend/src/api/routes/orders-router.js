import express from "express";

import { postOrder } from "../controllers/orders-controller.js";
import { authToken } from "../../middleware/authentication.js";
const router = express.Router();

router.route("/").post(authToken, postOrder);

export default router;
