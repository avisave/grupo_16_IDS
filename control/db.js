import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'terreno',
  password: 'lenin.1410',
  port: 5432,
});

export default pool;