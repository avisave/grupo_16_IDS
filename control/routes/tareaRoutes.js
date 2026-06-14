import express from "express";
import { getTareas, getTarea, createTarea, updateTarea, deleteTarea } from "../controllers/tareaController.js";

const router = express.Router();

router.get("/", getTareas);
router.get("/:id", getTarea);
router.post("/", createTarea);
router.put("/:id", updateTarea);
router.delete("/:id", deleteTarea);

export default router;
