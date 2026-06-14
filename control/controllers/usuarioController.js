import dotenv from "dotenv";
import pool from "../db.js";

dotenv.config();

/**
 * OBTENER USUARIOS
 * Tabla: inventario.usuario + inventario.usuario_contrasena
 */
export const getUsuarios = async (req, res) => {
  try {
    const query = `
      SELECT
        usuario_id_usuario                               AS id_usuario,
        usuario_username                                 AS username,
        usuario_correo                                   AS correo,
        usuario_rut_usuario                              AS rut_usuario,
        usuario_estado_cuenta                            AS estado_cuenta,
        usuario_fecha_de_creacion                        AS fecha_creacion,
        usuario_fecha_ultima_conexion                    AS ultima_conexion,
        usuario_nombre_completo_primer_nombre_usuario    AS primer_nombre,
        usuario_nombre_completo_segundo_nombre_usuario   AS segundo_nombre,
        usuario_nombre_completo_primer_apellido_usuario  AS primer_apellido,
        usuario_nombre_completo_segundo_apellido_usuario AS segundo_apellido,
        usuario_es_gerencia                              AS es_gerencia,
        usuario_es_tecnico                               AS es_tecnico,
        usuario_es_jop                                   AS es_jop,
        usuario_es_administrador                         AS es_administrador,
        usuario_es_secretaria                            AS es_secretaria,
        perfil_id_perfil                                 AS id_perfil,
        empleado_rut_empleado                            AS rut_empleado
      FROM inventario.usuario
      ORDER BY usuario_id_usuario DESC;
    `;

    const result = await pool.query(query);

    return res.json({
      ok: true,
      usuarios: result.rows
    });

  } catch (error) {
    console.error("ERROR getUsuarios:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al obtener usuarios"
    });
  }
};

/**
 * CREAR USUARIO
 * La contraseña se guarda en tabla separada: inventario.usuario_contrasena
 * Se usa una transacción para garantizar consistencia.
 */
export const createUsuario = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      username,
      correo,
      contrasena,
      rut_usuario,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      estado_cuenta,
      es_gerencia,
      es_tecnico,
      es_jop,
      es_administrador,
      es_secretaria,
      id_perfil,
      rut_empleado
    } = req.body;

    await client.query("BEGIN");

    // 1) Insertar usuario
    const insertUsuario = `
      INSERT INTO inventario.usuario (
        usuario_username,
        usuario_correo,
        usuario_rut_usuario,
        usuario_estado_cuenta,
        usuario_fecha_de_creacion,
        usuario_nombre_completo_primer_nombre_usuario,
        usuario_nombre_completo_segundo_nombre_usuario,
        usuario_nombre_completo_primer_apellido_usuario,
        usuario_nombre_completo_segundo_apellido_usuario,
        usuario_es_gerencia,
        usuario_es_tecnico,
        usuario_es_jop,
        usuario_es_administrador,
        usuario_es_secretaria,
        perfil_id_perfil,
        empleado_rut_empleado
      )
      VALUES (
        $1, $2, $3, $4,
        CURRENT_TIMESTAMP,
        $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15
      )
      RETURNING usuario_id_usuario AS id_usuario;
    `;

    const usuarioResult = await client.query(insertUsuario, [
      username,
      correo,
      rut_usuario ?? null,
      estado_cuenta ?? "activo",
      primer_nombre ?? null,
      segundo_nombre ?? null,
      primer_apellido ?? null,
      segundo_apellido ?? null,
      es_gerencia ?? false,
      es_tecnico ?? false,
      es_jop ?? false,
      es_administrador ?? false,
      es_secretaria ?? false,
      id_perfil ?? null,
      rut_empleado ?? null
    ]);

    const idUsuario = usuarioResult.rows[0].id_usuario;

    // 2) Insertar contraseña en tabla separada
    if (contrasena) {
      const insertContrasena = `
        INSERT INTO inventario.usuario_contrasena (usuario_id_usuario, usuario_contrasena)
        VALUES ($1, $2);
      `;
      await client.query(insertContrasena, [idUsuario, contrasena]);
    }

    await client.query("COMMIT");

    return res.status(201).json({
      ok: true,
      msg: "Usuario creado correctamente",
      id_usuario: idUsuario
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR createUsuario:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al crear usuario"
    });
  } finally {
    client.release();
  }
};

/**
 * ELIMINAR USUARIO
 * Elimina también la contraseña asociada (CASCADE no definido en schema, se hace manual).
 */
export const deleteUsuario = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // 1) Eliminar contraseña primero (FK usuario_contrasena → usuario)
    await client.query(
      `DELETE FROM inventario.usuario_contrasena WHERE usuario_id_usuario = $1`,
      [id]
    );

    // 2) Eliminar usuario
    const result = await client.query(
      `DELETE FROM inventario.usuario WHERE usuario_id_usuario = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado"
      });
    }

    await client.query("COMMIT");

    return res.json({
      ok: true,
      msg: "Usuario eliminado correctamente"
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("ERROR deleteUsuario:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al eliminar usuario"
    });
  } finally {
    client.release();
  }
};

/**
 * ACTUALIZAR USUARIO
 * No modifica la contraseña (usar endpoint dedicado si se necesita).
 */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      username,
      correo,
      rut_usuario,
      primer_nombre,
      segundo_nombre,
      primer_apellido,
      segundo_apellido,
      estado_cuenta,
      es_gerencia,
      es_tecnico,
      es_jop,
      es_administrador,
      es_secretaria,
      id_perfil,
      rut_empleado
    } = req.body;

    const query = `
      UPDATE inventario.usuario
      SET
        usuario_username                                 = $1,
        usuario_correo                                   = $2,
        usuario_rut_usuario                              = $3,
        usuario_estado_cuenta                            = $4,
        usuario_fecha_de_ultima_edicion                  = CURRENT_TIMESTAMP,
        usuario_nombre_completo_primer_nombre_usuario    = $5,
        usuario_nombre_completo_segundo_nombre_usuario   = $6,
        usuario_nombre_completo_primer_apellido_usuario  = $7,
        usuario_nombre_completo_segundo_apellido_usuario = $8,
        usuario_es_gerencia                              = $9,
        usuario_es_tecnico                               = $10,
        usuario_es_jop                                   = $11,
        usuario_es_administrador                         = $12,
        usuario_es_secretaria                            = $13,
        perfil_id_perfil                                 = $14,
        empleado_rut_empleado                            = $15
      WHERE usuario_id_usuario = $16;
    `;

    const result = await pool.query(query, [
      username,
      correo,
      rut_usuario ?? null,
      estado_cuenta,
      primer_nombre ?? null,
      segundo_nombre ?? null,
      primer_apellido ?? null,
      segundo_apellido ?? null,
      es_gerencia,
      es_tecnico,
      es_jop,
      es_administrador,
      es_secretaria,
      id_perfil ?? null,
      rut_empleado ?? null,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado"
      });
    }

    return res.json({
      ok: true,
      msg: "Usuario actualizado correctamente"
    });

  } catch (error) {
    console.error("ERROR updateUsuario:", error);

    return res.status(500).json({
      ok: false,
      msg: "Error al actualizar usuario"
    });
  }
};