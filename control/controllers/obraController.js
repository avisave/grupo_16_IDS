import pool from "../db.js";

export const getObras = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.id_obra AS id,
        o.id_especificacion_puerta,
        o.nombre_obra AS nombre,
        o.referencia AS ref,
        o.direccion_obra AS direccion,
        o.comuna,
        o.region,
        o.tipo_obra AS tipo,
        o.estado,
        o.cantidad_puerta AS cantidad,
        TO_CHAR(o.fecha_de_creacion, 'DD/MM/YYYY') AS creacion,
        c.rut_cliente AS rut,
        c.razon_social AS razon,
        ep.modelo_puerta,
        ep.zona,
        ep.sentido_apertura AS sentido,
        ep.materialidad_vano AS materialidad,
        ep.hoja_activa AS hoja,
        ep.diseno_puerta AS diseno,
        ep.observaciones AS obs
      FROM terreno.obra o
      LEFT JOIN terreno.cliente c ON o.rut_cliente = c.rut_cliente
      LEFT JOIN terreno.especificacion_puerta ep ON o.id_especificacion_puerta = ep.id_especificacion_puerta
      ORDER BY o.fecha_de_creacion DESC;
    `;

    const result = await pool.query(query);

    const obrasFormateadas = result.rows.map(row => ({
      id: row.id,
      id_especificacion_puerta: row.id_especificacion_puerta,
      nombre: row.nombre,
      ref: row.ref,
      direccion: row.direccion,
      comuna: row.comuna,
      region: row.region,
      tipo: row.tipo,
      estado: row.estado,
      cantidad: row.cantidad,
      creacion: row.creacion,
      rut: row.rut,
      razon: row.razon,
      puerta: {
        modelo: row.modelo_puerta || '',
        zona: row.zona || '',
        sentido: row.sentido || '',
        materialidad: row.materialidad || '',
        hoja: row.hoja || '',
        diseno: row.diseno || '',
        obs: row.obs || ''
      },
      notaventa: { numero: 'Pendiente', fecha: '-', vendedor: '-', monto: '-', obs: '' },
      ot: { id: '-', tipo: '-', estado: 'pendiente', prioridad: '-', fecha: '-', tecnico: '-', obs: 'Pendiente de cruce con inventario.' }
    }));

    return res.json({
      ok: true,
      obras: obrasFormateadas
    });

  } catch (error) {
    console.error("ERROR getObras:", error);
    return res.status(500).json({ ok: false, msg: "Error al obtener obras" });
  }
};

export const createObra = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { nombre, rut, direccion, comuna, region, tipo, cantidad, puerta } = req.body;

    if (!nombre || !rut || !direccion) {
      return res.status(400).json({ ok: false, msg: "Faltan campos obligatorios" });
    }

    await client.query('BEGIN');

    const queryMedidas = `
      INSERT INTO terreno.medidas_puerta (
        medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor,
        medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor,
        medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor,
        medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor,
        medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor,
        alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor
      ) VALUES (
        0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0, 0,0,0
      ) RETURNING id_medidas;
    `;
    const resultMedidas = await client.query(queryMedidas);
    const idMedidas = resultMedidas.rows[0].id_medidas;

    const queryEsp = `
      INSERT INTO terreno.especificacion_puerta (
        modelo_puerta, zona, sentido_apertura, materialidad_vano, 
        materialidad_marco_actual, solucion_marco, hoja_pasiva, hoja_activa, 
        diseno_puerta, observaciones_de_diseno, cubrejuntas, bisagras, observaciones, id_medidas
      ) VALUES (
        $1, $2, $3, $4, 
        'Pendiente', 'Pendiente', 'Pendiente', $5, 
        $6, '', false, 'Pendiente', $7, $8
      ) RETURNING id_especificacion_puerta;
    `;
    const valuesEsp = [
      puerta?.modelo || 'Sin modelo',
      puerta?.zona || 'Sin zona',
      puerta?.sentido || 'Derecha',
      puerta?.materialidad || 'Pendiente',
      puerta?.hoja || 'Pendiente',
      puerta?.diseno || 'Pendiente',
      puerta?.obs || '',
      idMedidas
    ];
    const resultEsp = await client.query(queryEsp, valuesEsp);
    const idEspecificacion = resultEsp.rows[0].id_especificacion_puerta;

    const refTemporal = `REF-${Math.floor(Math.random() * 10000)}`;

    const queryObra = `
      INSERT INTO terreno.obra (
        nombre_obra, direccion_obra, comuna, region, tipo_obra, 
        fecha_de_creacion, fecha_de_ultima_edicion, estado, cantidad_puerta, 
        referencia, rut_cliente, id_especificacion_puerta
      ) VALUES (
        $1, $2, $3, $4, $5, 
        CURRENT_DATE, CURRENT_DATE, 'activa', $6, 
        $7, $8, $9
      ) RETURNING id_obra;
    `;
    const valuesObra = [
      nombre, direccion, comuna || '', region || '', tipo,
      cantidad, refTemporal, rut, idEspecificacion
    ];
    const resultObra = await client.query(queryObra, valuesObra);

    await client.query('COMMIT');

    return res.status(201).json({
      ok: true,
      msg: "Obra creada correctamente",
      id: resultObra.rows[0].id_obra
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("ERROR createObra:", error);
    return res.status(500).json({ ok: false, msg: "Error al crear la obra" });
  } finally {
    client.release();
  }
};
