import pool from "../db.js";

export const obtenerUsuarioPorUsername = async (username) => {
  const result = await pool.query(
    `
    SELECT *
    FROM inventario.usuario
    WHERE "Username" = $1
    `,
    [username]
  );

  return result.rows[0];
};

export const obtenerUsuarioPorRut = async (rut) => {
  const result = await pool.query(
    `SELECT u.*, uc.usuario_contrasena
     FROM inventario.usuario u
     LEFT JOIN inventario.usuario_contrasena uc ON uc.usuario_id_usuario = u.usuario_id_usuario
     WHERE u.usuario_rut_usuario = $1`,
    [rut]
  );
  return result.rows[0];
};

export const crearUsuario = async (datos) => {
  const result = await pool.query(
    `
    INSERT INTO inventario.usuario
    (
      "Correo",
      "Username",
      "Estado_cuenta",
      "Primer_nombre",
      "Apellido_paterno",
      "Es_administrador"
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      datos.correo,
      datos.username,
      true,
      datos.nombre,
      datos.apellido,
      datos.esAdministrador
    ]
  );

  return result.rows[0];
};
