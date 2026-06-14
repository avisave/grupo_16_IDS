import pool from "../db.js";

export const getOrdenTrabajoByEspecificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ot.orden_trabajo_id_orden AS id,
              ot.orden_trabajo_fecha_hora AS fecha,
              ot.orden_trabajo_estado AS estado,
              ot.usuario_id_usuario,
              u.usuario_username AS usuario_username,
              u.usuario_nombre_completo_primer_nombre_usuario || ' ' || u.usuario_nombre_completo_primer_apellido_usuario AS usuario_nombre
       FROM inventario.orden_trabajo ot
       LEFT JOIN inventario.usuario u ON ot.usuario_id_usuario = u.usuario_id_usuario
       WHERE ot.especificaciones_puerta_id_especificacion_puerta = $1
       ORDER BY ot.orden_trabajo_fecha_hora DESC
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "No hay orden de trabajo para esta especificación" });
    }

    return res.json({ ok: true, orden: result.rows[0] });
  } catch (error) {
    console.error("ERROR getOrdenTrabajoByEspecificacion:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener orden de trabajo" });
  }
};

export const getDetalleOrdenTrabajo = async (req, res) => {
  try {
    const { id } = req.params;
    const otResult = await pool.query(
      `SELECT ot.orden_trabajo_id_orden AS id,
              ot.orden_trabajo_fecha_hora AS fecha,
              ot.orden_trabajo_estado AS estado,
              ot.especificaciones_puerta_id_especificacion_puerta,
              ot.usuario_id_usuario,
              u.usuario_username AS usuario_username,
              u.usuario_nombre_completo_primer_nombre_usuario || ' ' || u.usuario_nombre_completo_primer_apellido_usuario AS usuario_nombre
       FROM inventario.orden_trabajo ot
       LEFT JOIN inventario.usuario u ON ot.usuario_id_usuario = u.usuario_id_usuario
       WHERE ot.orden_trabajo_id_orden = $1`,
      [id]
    );

    if (otResult.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "No se encontró la orden de trabajo" });
    }

    const ot = otResult.rows[0];
    const espId = ot.especificaciones_puerta_id_especificacion_puerta;

    const [espRes, termRes, metalRes, herrajesRes, obraRes] = await Promise.all([
      pool.query(`SELECT * FROM terreno.especificacion_puerta WHERE id_especificacion_puerta = $1`, [espId]),
      pool.query(`SELECT * FROM terreno.especificacion_terminaciones WHERE id_especificacion_puerta = $1`, [espId]),
      pool.query(`SELECT * FROM terreno.especificacion_metalmecanica WHERE id_especificacion_puerta = $1`, [espId]),
      pool.query(`SELECT * FROM terreno.detalles_herraje WHERE id_especificacion_puerta = $1`, [espId]),
      pool.query(`SELECT o.*, c.razon_social, c.rut_cliente FROM terreno.obra o LEFT JOIN terreno.cliente c ON o.rut_cliente = c.rut_cliente WHERE o.id_especificacion_puerta = $1 LIMIT 1`, [espId]),
    ]);

    let medidasRes = { rows: [] };
    if (espRes.rows[0]?.id_medidas) {
      medidasRes = await pool.query(`SELECT * FROM terreno.medidas_puerta WHERE id_medidas = $1`, [espRes.rows[0].id_medidas]);
    }

    return res.json({
      ok: true,
      detalle: {
        ...ot,
        especificacion: espRes.rows[0] || null,
        terminaciones: termRes.rows[0] || null,
        metalmecanica: metalRes.rows[0] || null,
        herrajes: herrajesRes.rows || [],
        obra: obraRes.rows[0] || null,
        medidas: medidasRes.rows[0] || null
      }
    });
  } catch (error) {
    console.error("ERROR getDetalleOrdenTrabajo:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener detalle de OT" });
  }
};

export const createOrdenTrabajo = async (req, res) => {
  try {
    const { especificacion_id, usuario_id } = req.body;

    if (!especificacion_id || !usuario_id) {
      return res.status(400).json({ ok: false, msg: "especificacion_id y usuario_id son obligatorios" });
    }

    const result = await pool.query(
      `INSERT INTO inventario.orden_trabajo (
        orden_trabajo_estado,
        especificaciones_puerta_id_especificacion_puerta,
        area_trabajo_id_area,
        usuario_id_usuario
      ) VALUES ('pendiente', $1, 1, $2)
      RETURNING orden_trabajo_id_orden AS id`,
      [especificacion_id, usuario_id]
    );

    return res.status(201).json({
      ok: true,
      msg: "Orden de trabajo creada",
      id: result.rows[0].id
    });
  } catch (error) {
    console.error("ERROR createOrdenTrabajo:", error);
    return res.status(500).json({ ok: false, msg: "Error al crear orden de trabajo" });
  }
};

export const updateOrdenTrabajoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ ok: false, msg: "El campo estado es obligatorio" });
    }

    const result = await pool.query(
      `UPDATE inventario.orden_trabajo SET orden_trabajo_estado = $1
       WHERE orden_trabajo_id_orden = $2
       RETURNING orden_trabajo_id_orden AS id, orden_trabajo_estado AS estado`,
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "No se encontró la orden de trabajo" });
    }

    return res.json({ ok: true, orden: result.rows[0] });
  } catch (error) {
    console.error("ERROR updateOrdenTrabajoEstado:", error);
    return res.status(500).json({ ok: false, msg: "Error al actualizar estado" });
  }
};
