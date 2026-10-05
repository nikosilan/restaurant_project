import express from "express";

import {
  archiveMenuItemHandler,
  getAdminMenu,
  patchMenuItemLocation,
  postMenuItem,
  putMenuItem,
} from "../controllers/admin-menu-controller.js";
import { authToken } from "../../middleware/authentication.js";
import { requireAdmin } from "../../middleware/authorization.js";

const router = express.Router();

router.use(authToken, requireAdmin);
router.route("/").get(getAdminMenu).post(postMenuItem);
router
  .route("/:id")
  .put(putMenuItem)
  .patch(patchMenuItemLocation);
router.route("/:id/archive").patch(archiveMenuItemHandler);

export default router;
