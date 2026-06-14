import pool from "../db.js";

export const obtenerTodasLasTareas = async () => {
  const result = await pool.query(`
    SELECT
      t.id_tarea,
      t.titulo,
      t.descripcion,
      t.estado_de_tarea,
      t.urgencia,
      t.fecha_de_visita,
      t.fecha_de_termino,
      t.fecha_de_creacion,
      t.fecha_de_ultima_actualizacion,
      t.id_usuario,
      t.id_servicio_terreno,
      t.id_especificacion_puerta,
      t.instrucciones_de_oficina,
      t.bloque_horario,
      t.horario_limite,
      t.fecha_de_inicio,
      t.fecha_de_inicio_en_terreno,
      COALESCE(
        json_agg(
          json_build_object('id_usuario', tu.id_usuario)
        ) FILTER (WHERE tu.id_usuario IS NOT NULL),
        '[]'::json
      ) AS tecnicos
    FROM terreno.tarea t
    LEFT JOIN terreno.tarea_usuario tu ON tu.id_tarea = t.id_tarea
    GROUP BY t.id_tarea
    ORDER BY t.id_tarea DESC
  `);
  return result.rows;
};

export const obtenerTareaPorId = async (id) => {
  const result = await pool.query(`
    SELECT
      t.*,
      COALESCE(
        json_agg(
          json_build_object('id_usuario', tu.id_usuario)
        ) FILTER (WHERE tu.id_usuario IS NOT NULL),
        '[]'::json
      ) AS tecnicos
    FROM terreno.tarea t
    LEFT JOIN terreno.tarea_usuario tu ON tu.id_tarea = t.id_tarea
    WHERE t.id_tarea = $1
    GROUP BY t.id_tarea
  `, [id]);
  return result.rows[0];
};

export const crearTarea = async (datos, tecnicos = []) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(`
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
      )
      RETURNING id_tarea
    `, [
      datos.descripcion,
      datos.fecha_de_visita || new Date(),
      datos.fecha_de_termino || new Date(),
      datos.bloque_horario || new Date(),
      datos.fecha_de_inicio || new Date(),
      datos.fecha_de_inicio_en_terreno || new Date(),
      datos.titulo,
      datos.horario_limite || new Date(),
      datos.instrucciones_de_oficina || null,
      datos.urgencia || "media",
      datos.estado_de_tarea || "pendiente",
      datos.id_usuario ?? null,
      datos.id_servicio_terreno ?? null,
      datos.id_especificacion_puerta ?? null
    ]);

    const idTarea = result.rows[0].id_tarea;

    if (tecnicos.length > 0) {
      for (const idUsuario of tecnicos) {
        await client.query(`
          INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [idTarea, idUsuario]);
      }
    }

    await client.query("COMMIT");
    return { id_tarea: idTarea };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const actualizarTarea = async (id, datos, tecnicos = null) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const result = await client.query(`
      UPDATE terreno.tarea
      SET
        descripcion = COALESCE($1, descripcion),
        fecha_de_visita = COALESCE($2::date, fecha_de_visita),
        fecha_de_termino = COALESCE($3::date, fecha_de_termino),
        fecha_de_ultima_actualizacion = CURRENT_DATE,
        titulo = COALESCE($4, titulo),
        instrucciones_de_oficina = COALESCE($5, instrucciones_de_oficina),
        urgencia = COALESCE($6, urgencia),
        estado_de_tarea = COALESCE($7, estado_de_tarea),
        id_usuario = COALESCE($8, id_usuario),
        id_servicio_terreno = COALESCE($9, id_servicio_terreno),
        id_especificacion_puerta = COALESCE($10, id_especificacion_puerta)
      WHERE id_tarea = $11
    `, [
      datos.descripcion ?? null,
      datos.fecha_de_visita ?? null,
      datos.fecha_de_termino ?? null,
      datos.titulo ?? null,
      datos.instrucciones_de_oficina ?? null,
      datos.urgencia ?? null,
      datos.estado_de_tarea ?? null,
      datos.id_usuario ?? null,
      datos.id_servicio_terreno ?? null,
      datos.id_especificacion_puerta ?? null,
      id
    ]);

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    if (tecnicos !== null) {
      await client.query(`DELETE FROM terreno.tarea_usuario WHERE id_tarea = $1`, [id]);
      for (const idUsuario of tecnicos) {
        await client.query(`
          INSERT INTO terreno.tarea_usuario (id_tarea, id_usuario)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `, [id, idUsuario]);
      }
    }

    await client.query("COMMIT");
    return { id_tarea: id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const eliminarTarea = async (id) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM terreno.tarea_usuario WHERE id_tarea = $1`, [id]);
    const result = await client.query(`DELETE FROM terreno.tarea WHERE id_tarea = $1`, [id]);
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }
    await client.query("COMMIT");
    return { id_tarea: id };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
