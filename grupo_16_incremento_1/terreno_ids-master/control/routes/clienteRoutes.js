import express from "express";
import { getClientes, createCliente, updateCliente, getClientesSelector } from "../controllers/clienteController.js";

const router = express.Router();

router.get("/selector", getClientesSelector);
router.get("/", getClientes);
router.post("/", createCliente);
router.put("/:rut", updateCliente);

export default router;
