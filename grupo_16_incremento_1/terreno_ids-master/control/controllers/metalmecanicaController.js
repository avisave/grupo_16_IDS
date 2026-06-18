import pool from "../db.js";

export const getMetalmecanica = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id_metalmecanica, bastidor, cerradura, manillon, pernos_fijos,
              manilla, herraje, cerrojo, ojo, otros, id_especificacion_puerta
       FROM terreno.especificacion_metalmecanica
       WHERE id_especificacion_puerta = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "No se encontró metalmecánica para esta especificación" });
    }

    return res.json({ ok: true, metalmecanica: result.rows[0] });
  } catch (error) {
    console.error("ERROR getMetalmecanica:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener metalmecánica" });
  }
};

export const updateMetalmecanica = async (req, res) => {
  try {
    const { id } = req.params;
    const { bastidor, cerradura, manillon, pernos_fijos, manilla, herraje, cerrojo, ojo, otros } = req.body;

    const result = await pool.query(
      `INSERT INTO terreno.especificacion_metalmecanica (
        bastidor, cerradura, manillon, pernos_fijos, manilla, herraje,
        cerrojo, ojo, otros, id_especificacion_puerta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id_especificacion_puerta) DO UPDATE SET
        bastidor = COALESCE($1, terreno.especificacion_metalmecanica.bastidor),
        cerradura = COALESCE($2, terreno.especificacion_metalmecanica.cerradura),
        manillon = COALESCE($3, terreno.especificacion_metalmecanica.manillon),
        pernos_fijos = COALESCE($4, terreno.especificacion_metalmecanica.pernos_fijos),
        manilla = COALESCE($5, terreno.especificacion_metalmecanica.manilla),
        herraje = COALESCE($6, terreno.especificacion_metalmecanica.herraje),
        cerrojo = COALESCE($7, terreno.especificacion_metalmecanica.cerrojo),
        ojo = COALESCE($8, terreno.especificacion_metalmecanica.ojo),
        otros = COALESCE($9, terreno.especificacion_metalmecanica.otros)
      RETURNING *`,
      [bastidor || '', cerradura || '', manillon || '', pernos_fijos || '',
       manilla || '', herraje || '', cerrojo || '', ojo || '', otros || '', id]
    );

    return res.json({ ok: true, metalmecanica: result.rows[0] });
  } catch (error) {
    console.error("ERROR updateMetalmecanica:", error);
    return res.status(500).json({ ok: false, msg: "Error al actualizar metalmecánica" });
  }
};
