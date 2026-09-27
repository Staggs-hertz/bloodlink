import { Router } from "express";

import { inventoryController } from "../controllers/inventoryController";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { requireVerified } from "../middlewares/requireVerified";
import { validate } from "../middlewares/validate";
import { updateInventorySchema } from "../validators/inventoryValidator";

const router = Router();

router.use(authenticate, requireVerified);

// Hospitals and administrators can view blood inventory.
router.get(
  "/",
  authorize("HOSPITAL", "ADMIN", "SUPER_ADMIN"),
  inventoryController.getAll,
);

// Only administrators can modify blood inventory.
router.patch(
  "/:bloodType",
  authorize("ADMIN", "SUPER_ADMIN"),
  validate(updateInventorySchema),
  inventoryController.update,
);

export default router;
