import pool from "../control/db.js";
await pool.query("UPDATE inventario.usuario SET perfil_id_perfil = 2 WHERE usuario_username = 'felipe'");
console.log("felipe ahora es Técnico (perfil 2)");
await pool.end();
