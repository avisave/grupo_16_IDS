import pool from "../db.js";

const TABLE = "terreno.cliente";

export async function findAll() {
  const { rows } = await pool.query(
    `SELECT * FROM ${TABLE} ORDER BY rut_cliente ASC`
  );
  return rows;
}

export async function findByRut(rutCliente) {
  const { rows } = await pool.query(
    `SELECT * FROM ${TABLE} WHERE rut_cliente = $1`,
    [rutCliente]
  );
  return rows[0] || null;
}

export async function create(data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");

  const { rows } = await pool.query(
    `INSERT INTO ${TABLE} (${columns.join(", ")})
     VALUES (${placeholders})
     RETURNING *`,
    values
  );
  return rows[0];
}

export async function update(rutCliente, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);

  if (columns.length === 0) {
    return findByRut(rutCliente);
  }

  const setClause = columns
    .map((col, i) => `${col} = $${i + 1}`)
    .join(", ");

  const { rows } = await pool.query(
    `UPDATE ${TABLE}
     SET ${setClause}
     WHERE rut_cliente = $${columns.length + 1}
     RETURNING *`,
    [...values, rutCliente]
  );
  return rows[0] || null;
}
