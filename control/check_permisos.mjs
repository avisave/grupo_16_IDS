import pool from './db.js';

const r1 = await pool.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'inventario' AND table_name = 'permiso' ORDER BY ordinal_position"
);
console.log('permiso columns:', JSON.stringify(r1.rows, null, 2));

const r2 = await pool.query("SELECT * FROM inventario.permiso LIMIT 20");
console.log('permiso data:', JSON.stringify(r2.rows, null, 2));

const r3 = await pool.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'inventario' AND table_name = 'perfil_permiso' ORDER BY ordinal_position"
);
console.log('perfil_permiso columns:', JSON.stringify(r3.rows, null, 2));

const r4 = await pool.query("SELECT * FROM inventario.perfil_permiso LIMIT 20");
console.log('perfil_permiso data:', JSON.stringify(r4.rows, null, 2));

const r5 = await pool.query("SELECT usuario_id_usuario, usuario_username, perfil_id_perfil FROM inventario.usuario ORDER BY usuario_id_usuario");
console.log('users with perfil:', JSON.stringify(r5.rows, null, 2));

pool.end();
