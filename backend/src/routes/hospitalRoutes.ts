import { Router } from "express";
import { hospitalController } from "../controllers/hospitalController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { validate } from "../middlewares/validate";
import { updateHospitalProfileSchema } from "../validators/hospitalValidator";

const router = Router();

// Require authentication for all hospital profile endpoints.
router.use(authenticate);

router.get("/me", authorize("HOSPITAL"), hospitalController.getMe);

router.patch(
  "/me",
  authorize("HOSPITAL"),
  validate(updateHospitalProfileSchema),
  hospitalController.updateProfile,
);

export default router;
