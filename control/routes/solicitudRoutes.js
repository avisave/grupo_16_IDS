import express from "express";
import { getSolicitudes, createSolicitud, aprobarSolicitud, rechazarSolicitud } from "../controllers/solicitudController.js";

const router = express.Router();

router.get("/", getSolicitudes);
router.post("/", createSolicitud);
router.put("/:id/aprobar", aprobarSolicitud);
router.put("/:id/rechazar", rechazarSolicitud);

export default router;
