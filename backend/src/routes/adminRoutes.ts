import { Router } from "express";

import { adminController } from "../controllers/adminController";

import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";

import {
  updateStatusSchema,
  changeRoleSchema,
  verifyInstitutionSchema,
  paginationSchema,
} from "../validators/adminValidator";

const router = Router();

router.use(authenticate, requireVerified);

router.get(
  "/dashboard-summary",
  authorize("ADMIN", "SUPER_ADMIN"),
  adminController.getDashboardSummary,
);

// View all users.
router.get(
  "/users",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(paginationSchema),
  adminController.getUsers,
);

// Activate or deactivate a user.
router.patch(
  "/users/:id/status",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(updateStatusSchema),
  adminController.updateUserStatus,
);

// Change a user's role.
// Only SUPER_ADMIN can perform role changes.
router.patch(
  "/users/:id/role",
  authorize("SUPER_ADMIN"),
  validate(changeRoleSchema),
  adminController.changeUserRole,
);

// Verify or revoke verification for a hospital institution.
router.patch(
  "/users/:id/verify-institution",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(verifyInstitutionSchema),
  adminController.verifyInstitution,
);

export default router;
