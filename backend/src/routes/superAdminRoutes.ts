import { Router } from "express";

import { superAdminController } from "../controllers/superAdminController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";
import {
  superAdminUserIdSchema,
  superAdminPaginationSchema,
  updateAdminStatusSchema,
} from "../validators/superAdminValidator";

const router = Router();

router.use(authenticate, requireVerified, authorize("SUPER_ADMIN"));

router.get(
  "/admins",
  validate(superAdminPaginationSchema),
  superAdminController.getAdmins,
);

router.patch(
  "/admins/:id/status",
  validate(updateAdminStatusSchema),
  superAdminController.updateAdminStatus,
);

router.delete(
  "/admins/:id",
  validate(superAdminUserIdSchema),
  superAdminController.deleteAdmin,
);

export default router;
