import pool from "../db.js";

class ObraModel {
  static async getAll() {
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
    return result.rows;
  }

  static async create(data) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const queryMedidas = `
        INSERT INTO terreno.medidas_puerta (
          medidas_marco_ancho, medidas_marco_alto, medidas_marco_espesor,
          medidas_vano_vertical_ancho, medidas_vano_vertical_alto, medidas_vano_vertical_espesor,
          medidas_vano_horizontal_ancho, medidas_vano_horizontal_alto, medidas_vano_horizontal_espesor,
          medidas_alojamiento_vertical_alto, medidas_alojamiento_vertical_ancho, medidas_alojamiento_vertical_espesor,
          medidas_alojamiento_horizontal_alto, medidas_alojamiento_horizontal_ancho, medidas_alojamiento_horizontal_espesor,
          alojamiento_vertical, medidas_de_marco_ancho, medidas_de_marco_alto, medidas_de_marco_espesor
        ) VALUES (0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0, 0, 0,0,0) 
        RETURNING id_medidas;
      `;
      const resMedidas = await client.query(queryMedidas);
      const idMedidas = resMedidas.rows[0].id_medidas;

      const queryEsp = `
        INSERT INTO terreno.especificacion_puerta (
          modelo_puerta, zona, sentido_apertura, materialidad_vano, 
          materialidad_marco_actual, solucion_marco, hoja_pasiva, hoja_activa, 
          diseno_puerta, observaciones_de_diseno, cubrejuntas, bisagras, observaciones, id_medidas
        ) VALUES ($1, $2, $3, $4, 'Pendiente', 'Pendiente', 'Pendiente', $5, $6, '', false, 'Pendiente', $7, $8)
        RETURNING id_especificacion_puerta;
      `;
      const resEsp = await client.query(queryEsp, [
        data.puerta?.modelo || 'Sin modelo',
        data.puerta?.zona || 'Sin zona',
        data.puerta?.sentido || 'Derecha',
        data.puerta?.materialidad || 'Pendiente',
        data.puerta?.hoja || 'Pendiente',
        data.puerta?.diseno || 'Pendiente',
        data.puerta?.obs || '',
        idMedidas
      ]);
      const idEspecificacion = resEsp.rows[0].id_especificacion_puerta;

      const refTemporal = `REF-${Math.floor(Math.random() * 10000)}`;
      const queryObra = `
        INSERT INTO terreno.obra (
          nombre_obra, direccion_obra, comuna, region, tipo_obra, 
          fecha_de_creacion, fecha_de_ultima_edicion, estado, cantidad_puerta, 
          referencia, rut_cliente, id_especificacion_puerta
        ) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE, 'activa', $6, $7, $8, $9)
        RETURNING id_obra;
      `;
      const resObra = await client.query(queryObra, [
        data.nombre, data.direccion, data.comuna || '', data.region || '', data.tipo,
        data.cantidad, refTemporal, data.rut, idEspecificacion
      ]);

      await client.query('COMMIT');
      return resObra.rows[0].id_obra;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default ObraModel;
