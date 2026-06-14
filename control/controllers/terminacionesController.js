import pool from "../db.js";

export const getTerminaciones = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT id_terminacion, herrajes, pletina, funda, medida_final, manilla,
              marco_metalico, bisagras, molduras, rebaje, canterias, enchape,
              id_especificacion_puerta
       FROM terreno.especificacion_terminaciones
       WHERE id_especificacion_puerta = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ ok: false, msg: "No se encontraron terminaciones para esta especificación" });
    }

    return res.json({ ok: true, terminaciones: result.rows[0] });
  } catch (error) {
    console.error("ERROR getTerminaciones:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener terminaciones" });
  }
};

export const updateTerminaciones = async (req, res) => {
  try {
    const { id } = req.params;
    const { herrajes, pletina, funda, medida_final, manilla, marco_metalico, bisagras, molduras, rebaje, canterias, enchape } = req.body;

    const result = await pool.query(
      `INSERT INTO terreno.especificacion_terminaciones (
        herrajes, pletina, funda, medida_final, manilla, marco_metalico,
        bisagras, molduras, rebaje, canterias, enchape, id_especificacion_puerta
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (id_especificacion_puerta) DO UPDATE SET
        herrajes = COALESCE($1, terreno.especificacion_terminaciones.herrajes),
        pletina = COALESCE($2, terreno.especificacion_terminaciones.pletina),
        funda = COALESCE($3, terreno.especificacion_terminaciones.funda),
        medida_final = COALESCE($4, terreno.especificacion_terminaciones.medida_final),
        manilla = COALESCE($5, terreno.especificacion_terminaciones.manilla),
        marco_metalico = COALESCE($6, terreno.especificacion_terminaciones.marco_metalico),
        bisagras = COALESCE($7, terreno.especificacion_terminaciones.bisagras),
        molduras = COALESCE($8, terreno.especificacion_terminaciones.molduras),
        rebaje = COALESCE($9, terreno.especificacion_terminaciones.rebaje),
        canterias = COALESCE($10, terreno.especificacion_terminaciones.canterias),
        enchape = COALESCE($11, terreno.especificacion_terminaciones.enchape)
      RETURNING *`,
      [herrajes || '', pletina ?? 0, funda ?? 0, medida_final ?? 0, manilla ?? 0,
       marco_metalico ? 1 : 0, bisagras ?? 0, molduras || '', rebaje || '',
       canterias || '', enchape || '', id]
    );

    return res.json({ ok: true, terminaciones: result.rows[0] });
  } catch (error) {
    console.error("ERROR updateTerminaciones:", error);
    return res.status(500).json({ ok: false, msg: "Error al actualizar terminaciones" });
  }
};
