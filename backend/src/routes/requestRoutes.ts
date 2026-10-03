import { Router } from "express";
import { requestController } from "../controllers/requestController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";
import {
  createRequestSchema,
  approveRequestSchema,
  rejectRequestSchema,
} from "../validators/requestValidator";

const router = Router();
router.use(authenticate, requireVerified);

// HOSPITAL routes

router.post(
  "/",
  authorize("HOSPITAL"),
  validate(createRequestSchema),
  requestController.create,
);

router.get("/mine", authorize("HOSPITAL"), requestController.getMine);

// ADMIN and SUPER_ADMIN routes

router.get("/", authorize("ADMIN", "SUPER_ADMIN"), requestController.getAll);

router.get(
  "/:id/matching-donors",
  authorize("ADMIN", "SUPER_ADMIN"),
  requestController.getMatchingDonors,
);

router.patch(
  "/:id/approve",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(approveRequestSchema),
  requestController.approve,
);

router.patch(
  "/:id/reject",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(rejectRequestSchema),
  requestController.reject,
);

// HOSPITAL and administrators can access a specific request.
// Ownership is enforced inside the service for HOSPITAL users.

router.get(
  "/:id",
  authorize("HOSPITAL", "ADMIN", "SUPER_ADMIN"),
  requestController.getById,
);

export default router;
