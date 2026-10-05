import express from "express";

import adminMenuRouter from "./routes/admin-menu-router.js";
import authRouter from "./routes/auth-router.js";
import healthRouter from "./routes/health-router.js";
import menuRouter from "./routes/menu-router.js";
import ordersRouter from "./routes/orders-router.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/admin/menu", adminMenuRouter);
router.use("/health", healthRouter);
router.use("/menu", menuRouter);
router.use("/orders", ordersRouter);

export default router;
