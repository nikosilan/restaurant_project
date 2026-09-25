import express from "express";

import healthRouter from "./routes/health-router.js";
import menuRouter from "./routes/menu-router.js";
import ordersRouter from "./routes/orders-router.js";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/menu", menuRouter);
router.use("/orders", ordersRouter);

export default router;
