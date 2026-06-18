import { Router } from "express";
import {
  getOrdenTrabajoByEspecificacion,
  getDetalleOrdenTrabajo,
  createOrdenTrabajo,
  updateOrdenTrabajoEstado
} from "../controllers/ordenTrabajoController.js";

const router = Router();

router.get("/especificacion/:id", getOrdenTrabajoByEspecificacion);
router.get("/:id/detalle", getDetalleOrdenTrabajo);
router.post("/", createOrdenTrabajo);
router.put("/:id/estado", updateOrdenTrabajoEstado);

export default router;
