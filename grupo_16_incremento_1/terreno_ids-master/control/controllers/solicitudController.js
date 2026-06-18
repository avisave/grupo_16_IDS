import pool from "../db.js";

export const getSolicitudes = async (req, res) => {
  try {
    const { estado } = req.query;
    let query = `
      SELECT s.*, u.usuario_username AS solicitante_username
      FROM inventario.solicitud_permiso s
      LEFT JOIN inventario.usuario u ON u.usuario_id_usuario = s.id_usuario_solicitante
    `;
    const params = [];
    if (estado) {
      query += ` WHERE s.estado = $1`;
      params.push(estado);
    }
    query += ` ORDER BY s.fecha_creacion DESC`;
    const result = await pool.query(query, params);
    return res.json({ ok: true, solicitudes: result.rows });
  } catch (error) {
    console.error("ERROR getSolicitudes:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener solicitudes" });
  }
};

export const createSolicitud = async (req, res) => {
  try {
    const { id_usuario_solicitante, accion, datos } = req.body;
    if (!id_usuario_solicitante || !accion) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios" });
    }
    const result = await pool.query(
      `INSERT INTO inventario.solicitud_permiso (id_usuario_solicitante, accion, datos)
       VALUES ($1, $2, $3) RETURNING id_solicitud`,
      [id_usuario_solicitante, accion, datos ? JSON.stringify(datos) : null]
    );
    return res.status(201).json({
      ok: true,
      msg: "Solicitud enviada. Espera aprobación de un administrador.",
      id_solicitud: result.rows[0].id_solicitud
    });
  } catch (error) {
    console.error("ERROR createSolicitud:", error);
    return res.status(500).json({ ok: false, msg: "Error al crear solicitud" });
  }
};

export const aprobarSolicitud = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { id_usuario_revisor } = req.body;

    await client.query("BEGIN");

    const sol = await client.query(
      `SELECT * FROM inventario.solicitud_permiso WHERE id_solicitud = $1 AND estado = 'pendiente'`,
      [id]
    );
    if (sol.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "Solicitud no encontrada o ya resuelta" });
    }

    const solicitud = sol.rows[0];

    // Ejecutar la acción según el tipo
    if (solicitud.accion === "crear_tarea") {
      const datos = typeof solicitud.datos === "string" ? JSON.parse(solicitud.datos) : solicitud.datos;
      const { tecnicos, ...tareaData } = datos;
      const insertResult = await client.query(`
        INSERT INTO terreno.tarea (
          descripcion, fecha_de_visita, fecha_de_termino,
          bloque_horario, fecha_de_creacion, fecha_de_ultima_actualizacion,
          fecha_de_inicio, fecha_de_inicio_en_terreno, titulo,
          horario_limite, instrucciones_de_oficina, urgencia,
          estado_de_tarea, id_usuario, id_servicio_terreno,
          id_especificacion_puerta
        ) VALUES (
          $1, $2, $3,
          $4, CURRENT_DATE, CURRENT_DATE,
          $5, $6, $7,
          $8, $9, $10,
          $11, $12, $13,
          $14
        ) RETURNING id_tarea
      `, [
        tareaData.descripcion || "",
        tareaData.fecha_de_visita || new Date(),
        tareaData.fecha_de_termino || new Date(),
        tareaData.bloque_horario || new Date(),
        tareaData.fecha_de_inicio || new Date(),
        tareaData.fecha_de_inicio_en_terreno || new Date(),
        tareaData.titulo || "Sin título",
        tareaData.horario_limite || new Date(),
        tareaData.instrucciones_de_oficina || null,
        tareaData.urgencia || "media",
        tareaData.estado_de_tarea || "pendiente",
        solicitud.id_usuario_solicitante,
        null, null
      ]);
      const idTarea = insertResult.rows[0].id_tarea;
      if (tecnicos && tecnicos.length > 0) {
        for (const idUsuario of tecnicos) {
          await client.query(
            `INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
            [idTarea, idUsuario]
          );
        }
      }
    }

    await client.query(
      `UPDATE inventario.solicitud_permiso SET estado = 'aprobada', fecha_resolucion = CURRENT_TIMESTAMP, id_usuario_revisor = $1 WHERE id_solicitud = $2`,
      [id_usuario_revisor, id]
    );

    await client.query("COMMIT");
    return res.json({ ok: true, msg: "Solicitud aprobada" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR aprobarSolicitud:", error);
    return res.status(500).json({ ok: false, msg: "Error al aprobar solicitud" });
  } finally {
    client.release();
  }
};

export const rechazarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_usuario_revisor, motivo } = req.body;

    const result = await pool.query(
      `UPDATE inventario.solicitud_permiso SET estado = 'rechazada', fecha_resolucion = CURRENT_TIMESTAMP, id_usuario_revisor = $1, motivo_rechazo = $2 WHERE id_solicitud = $3 AND estado = 'pendiente'`,
      [id_usuario_revisor, motivo || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ ok: false, msg: "Solicitud no encontrada o ya resuelta" });
    }
    return res.json({ ok: true, msg: "Solicitud rechazada" });
  } catch (error) {
    console.error("ERROR rechazarSolicitud:", error);
    return res.status(500).json({ ok: false, msg: "Error al rechazar solicitud" });
  }
};
