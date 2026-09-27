import { Router } from "express";

import { notificationController } from "../controllers/notificationController";
import { authenticate } from "../middlewares/authenticate";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";
import { notificationIdSchema } from "../validators/notificationValidator";

const router = Router();

router.use(authenticate, requireVerified);

router.get("/", notificationController.getMine);

router.patch(
  "/:id/read",
  validate(notificationIdSchema),
  notificationController.markAsRead,
);

export default router;
