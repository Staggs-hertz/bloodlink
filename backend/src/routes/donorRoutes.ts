import { Router } from "express";
import { donorController } from "../controllers/donorController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";
import {
  updateAvailabilitySchema,
  updateBloodTypeSchema,
  updateDonorProfileSchema,
} from "../validators/donorValidator";

const router = Router();

router.use(authenticate, requireVerified);

router.get("/", authorize("ADMIN", "SUPER_ADMIN"), donorController.getAll);
router.get("/me", authorize("DONOR"), donorController.getMe);
router.patch(
  "/me/availability",
  authorize("DONOR"),
  validate(updateAvailabilitySchema),
  donorController.updateAvailability,
);
router.patch(
  "/me/blood-type",
  authorize("DONOR"),
  validate(updateBloodTypeSchema),
  donorController.updateBloodType,
);
router.patch(
  "/me",
  authorize("DONOR"),
  validate(updateDonorProfileSchema),
  donorController.updateProfile,
);

export default router;
