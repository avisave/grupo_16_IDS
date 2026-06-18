import pool from "../db.js";
import {
  obtenerTodasLasTareas,
  obtenerTareaPorId,
  crearTarea,
  actualizarTarea,
  eliminarTarea
} from "../models/tareaModel.js";

const esOperario = async (userId) => {
  if (!userId) return false;
  const r = await pool.query(
    "SELECT perfil_id_perfil FROM inventario.usuario WHERE usuario_id_usuario = $1",
    [userId]
  );
  const perfil = Number(r.rows[0].perfil_id_perfil);
  return perfil === 2 || perfil === 3;
};

export const getTareas = async (req, res) => {
  try {
    const tareas = await obtenerTodasLasTareas();
    return res.json({ ok: true, tareas });
  } catch (error) {
    console.error("ERROR getTareas:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener tareas" });
  }
};

export const getTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await obtenerTareaPorId(id);
    if (!tarea) {
      return res.status(404).json({ ok: false, msg: "Tarea no encontrada" });
    }
    return res.json({ ok: true, tarea });
  } catch (error) {
    console.error("ERROR getTarea:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener tarea" });
  }
};

export const createTarea = async (req, res) => {
  try {
    const userId = parseInt(req.headers["x-user-id"]);
    if (await esOperario(userId)) {
      const solResult = await pool.query(
        `INSERT INTO inventario.solicitud_permiso (id_usuario_solicitante, accion, datos)
         VALUES ($1, 'crear_tarea', $2) RETURNING id_solicitud`,
        [userId, JSON.stringify(req.body)]
      );
      return res.status(201).json({
        ok: true,
        solicitud_creada: true,
        msg: "Solicitud de creación enviada a administrador",
        id_solicitud: solResult.rows[0].id_solicitud
      });
    }
    const { tecnicos, ...datos } = req.body;
    const result = await crearTarea(datos, tecnicos || []);
    return res.status(201).json({
      ok: true,
      msg: "Tarea creada correctamente",
      id_tarea: result.id_tarea
    });
  } catch (error) {
    console.error("ERROR createTarea:", error);
    return res.status(500).json({ ok: false, msg: "Error al crear tarea" });
  }
};

export const updateTarea = async (req, res) => {
  try {
    const userId = parseInt(req.headers["x-user-id"]);
    if (await esOperario(userId)) {
      const solResult = await pool.query(
        `INSERT INTO inventario.solicitud_permiso (id_usuario_solicitante, accion, datos)
         VALUES ($1, 'editar_tarea', $2) RETURNING id_solicitud`,
        [userId, JSON.stringify({ id: req.params.id, ...req.body })]
      );
      return res.status(201).json({
        ok: true,
        solicitud_creada: true,
        msg: "Solicitud de edición enviada a administrador",
        id_solicitud: solResult.rows[0].id_solicitud
      });
    }
    const { id } = req.params;
    const { tecnicos, ...datos } = req.body;
    const result = await actualizarTarea(id, datos, tecnicos);
    if (!result) {
      return res.status(404).json({ ok: false, msg: "Tarea no encontrada" });
    }
    return res.json({ ok: true, msg: "Tarea actualizada correctamente" });
  } catch (error) {
    console.error("ERROR updateTarea:", error);
    return res.status(500).json({ ok: false, msg: "Error al actualizar tarea" });
  }
};

export const deleteTarea = async (req, res) => {
  try {
    const userId = parseInt(req.headers["x-user-id"]);
    if (await esOperario(userId)) {
      const solResult = await pool.query(
        `INSERT INTO inventario.solicitud_permiso (id_usuario_solicitante, accion, datos)
         VALUES ($1, 'eliminar_tarea', $2) RETURNING id_solicitud`,
        [userId, JSON.stringify({ id_tarea: parseInt(req.params.id) })]
      );
      return res.status(201).json({
        ok: true,
        solicitud_creada: true,
        msg: "Solicitud de eliminación enviada a administrador",
        id_solicitud: solResult.rows[0].id_solicitud
      });
    }
    const { id } = req.params;
    const result = await eliminarTarea(id);
    if (!result) {
      return res.status(404).json({ ok: false, msg: "Tarea no encontrada" });
    }
    return res.json({ ok: true, msg: "Tarea eliminada correctamente" });
  } catch (error) {
    console.error("ERROR deleteTarea:", error);
    return res.status(500).json({ ok: false, msg: "Error al eliminar tarea" });
  }
};
