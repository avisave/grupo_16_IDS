import pool from "../control/db.js";

try {
  const cols = await pool.query(
    `SELECT column_name, data_type FROM information_schema.columns 
     WHERE table_schema = 'inventario' AND table_name = 'usuario'
     ORDER BY ordinal_position`
  );
  console.log("=== Columnas usuario ===");
  cols.rows.forEach(c => console.log(c.column_name, c.data_type));

  const tbl = await pool.query(
    `SELECT table_name FROM information_schema.tables 
     WHERE table_schema = 'inventario' AND table_name = 'usuario_contrasena'`
  );
  console.log("\n=== usuario_contrasena table exists:", tbl.rows.length > 0);
  if (tbl.rows.length > 0) {
    const ct = await pool.query("SELECT * FROM inventario.usuario_contrasena LIMIT 5");
    console.log("usuario_contrasena rows:", ct.rows.length);
    ct.rows.forEach(r => console.log(JSON.stringify(r)));
  }

  const ruts = await pool.query(
    "SELECT usuario_id_usuario, usuario_username, usuario_rut_usuario, perfil_id_perfil FROM inventario.usuario LIMIT 10"
  );
  console.log("\n=== Usuarios ===");
  ruts.rows.forEach(u => console.log(u.usuario_id_usuario, u.usuario_username, u.usuario_rut_usuario, "perfil:", u.perfil_id_perfil));

  const u = await pool.query(
    `SELECT u.*, uc.usuario_contrasena
     FROM inventario.usuario u
     LEFT JOIN inventario.usuario_contrasena uc ON uc.usuario_id_usuario = u.usuario_id_usuario
     WHERE u.usuario_rut_usuario = '12123123-4'`
  );
  console.log("\n=== Felipe query result ===");
  console.log(JSON.stringify(u.rows[0], null, 2));
} catch(e) { console.error(e); } finally { pool.end(); }
