import { Router } from "express";
import { getTerminaciones, updateTerminaciones } from "../controllers/terminacionesController.js";

const router = Router();

router.get("/:id", getTerminaciones);
router.put("/:id", updateTerminaciones);

export default router;
