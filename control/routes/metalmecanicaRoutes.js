import { Router } from "express";
import { getMetalmecanica, updateMetalmecanica } from "../controllers/metalmecanicaController.js";

const router = Router();

router.get("/:id", getMetalmecanica);
router.put("/:id", updateMetalmecanica);

export default router;
