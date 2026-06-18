import pool from './db.js';

const r = await pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'inventario' ORDER BY table_name"
);
console.log('inventario tables:', r.rows.map(x => x.table_name));

const r2 = await pool.query(
  "SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'inventario' AND table_name = 'perfil' ORDER BY ordinal_position"
);
console.log('perfil columns:', JSON.stringify(r2.rows, null, 2));

const r3 = await pool.query("SELECT * FROM inventario.perfil LIMIT 10");
console.log('perfil data:', JSON.stringify(r3.rows, null, 2));

pool.end();
